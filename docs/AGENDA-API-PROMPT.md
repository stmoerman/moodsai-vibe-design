# Agenda API Routes — Implementation Prompt

Build 4 API routes that serve therapist agenda/calendar data from a PostgreSQL database. These routes power the agenda calendar UI (see `docs/AGENDA-UI-PROMPT.md` for the frontend spec).

## Database

```
Connection: postgres://beheerder:Fhxf01ACYHQ4DB3flFNLHb3afISSfAInFtbUcNw8GPPgI4JUg4AFTBh9vmwaw32W@78.47.198.247:5999/postgres
Schema: silver
Table: silver.hci_time_entry (1.2M rows)
Organization ID: ec45b04e-9191-4e6c-83dc-f20d321be5ef
```

Use `pg` (node-postgres) directly — NOT an ORM. Set `search_path=silver,public` on the connection.

### Key columns

| Column | Type | Purpose |
|--------|------|---------|
| `id` | uuid | Primary key |
| `organization_id` | uuid | Always filter by this (multi-tenant) |
| `report_id` | int | Use **56** for agenda data |
| `datum` | date | Appointment date |
| `tijd` | text | Start time "HH:mm" |
| `direct_duur` | float | Duration in minutes |
| `rb_naam` | text | Therapist display name |
| `activiteit_type` | text | Raw activity classification (see mapping below) |
| `r56_client_naam` | text | Client name (null = open/unbooked slot) |
| `r56_status_omschr` | text | "Ja" = confirmed, null = open |
| `locatie` | text | Location string (physical or online room name) |
| `omschrijving` | text | Free-text description/notes |

### Activity type mapping (SQL CASE)

Map the raw `activiteit_type` column to our 6 calendar categories:

```sql
CASE
  WHEN activiteit_type ILIKE '%behandeling%' OR activiteit_type = 'zpm1010' THEN 'behandeling'
  WHEN activiteit_type ILIKE '%workshop%'    OR activiteit_type = 'zpm1040' THEN 'workshop'
  WHEN activiteit_type ILIKE '%diagnostiek%' OR activiteit_type = 'zpm1001' THEN 'diagnostiek'
  WHEN activiteit_type ILIKE '%evaluatie%'   OR activiteit_type = 'zpm1070' THEN 'evaluatie'
  WHEN activiteit_type ILIKE '%intake%'      OR activiteit_type LIKE '300%' THEN 'intake'
  WHEN activiteit_type ILIKE '%gereserveerd%'                               THEN 'reserved'
  ELSE 'other'
END AS activity_type
```

### Activity filter (WHERE clause addition)

Only include calendar-worthy entries:

```sql
AND (
  activiteit_type IN (
    'zpm behandeling', 'zpm diagnostiek', 'workshop',
    'evaluatiegesprek rb', 'optie intake nl',
    'gereserveerd t.b.v. afspraakplanning hv',
    'gereserveerd optie afspraak eigen client',
    'e-mail of telefonisch contact'
  )
  OR activiteit_type LIKE '300%'
  OR activiteit_type LIKE 'zpm1010%'
  OR activiteit_type LIKE 'zpm1001%'
  OR activiteit_type LIKE 'zpm1040%'
  OR activiteit_type LIKE 'zpm1070%'
)
```

### Base WHERE clause for all queries

Every query must include:

```sql
WHERE organization_id = 'ec45b04e-9191-4e6c-83dc-f20d321be5ef'
  AND report_id = 56
  AND tijd IS NOT NULL AND tijd != ''
```

---

## Types

```typescript
type AgendaActivityType =
  | "behandeling"  // Treatment session (1-on-1, 45-60 min)
  | "workshop"     // Group therapy (90 min, multiple clients)
  | "diagnostiek"  // Diagnostic assessment (45-130 min)
  | "evaluatie"    // Evaluation meeting (45 min, often 2 therapists)
  | "intake"       // Open intake slot (120 min, no client)
  | "reserved"     // Reserved for planning (60-180 min)
  | "other";

type AgendaEntry = {
  id: string;
  date: string;                    // "2026-06-01"
  startTime: string;               // "09:00"
  endTime: string;                 // computed: startTime + duration
  duration: number;                // minutes
  activityType: AgendaActivityType;
  therapistName: string;
  clientName: string | null;       // null = open/unbooked
  status: string | null;           // "Ja" = confirmed
  location: string;
  description: string;
};

type LocationType = "physical" | "online" | "home" | "phone" | "unknown";

type AgendaLocation = {
  name: string;
  type: LocationType;
  city: string | null;             // "Amsterdam", "Utrecht", etc.
  entryCount: number;
};

type AgendaStats = {
  period: { start: string; end: string };
  totalEntries: number;
  byType: Record<AgendaActivityType, { count: number; avgDuration: number; withClient: number }>;
  byMonth: Array<{ year: number; month: number; total: number; therapists: number }>;
};

type AgendaTherapist = {
  name: string;
  entryCount: number;
  activityTypes: AgendaActivityType[];
};
```

---

## Utility: compute end time

```typescript
function computeEndTime(startTime: string, durationMinutes: number): string {
  const [h, m] = startTime.split(":").map(Number);
  const total = (h ?? 0) * 60 + (m ?? 0) + durationMinutes;
  const endH = Math.floor(total / 60) % 24;
  const endM = total % 60;
  return `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
}
```

## Utility: classify location

```typescript
function classifyLocation(locatie: string): { type: LocationType; city: string | null } {
  const lower = locatie.toLowerCase();
  if (lower.startsWith("online behandelkamer") || lower.startsWith("online ")) return { type: "online", city: null };
  if (lower.includes("thuis") || lower.includes("bij client")) return { type: "home", city: null };
  if (lower.includes("telefonisch")) return { type: "phone", city: null };

  const cityPatterns = [
    { pattern: /amsterdam/i, city: "Amsterdam" },
    { pattern: /utrecht daltonlaan/i, city: "Utrecht" },
    { pattern: /utrecht/i, city: "Utrecht" },
    { pattern: /rotterdam/i, city: "Rotterdam" },
    { pattern: /nijmegen/i, city: "Nijmegen" },
    { pattern: /heerlen/i, city: "Heerlen" },
    { pattern: /venray/i, city: "Venray" },
  ];
  for (const { pattern, city } of cityPatterns) {
    if (pattern.test(locatie)) return { type: "physical", city };
  }
  return { type: "unknown", city: null };
}
```

---

## API Routes

### 1. GET /api/agenda/entries

**Params:** `start` (date), `end` (date), `types?` (comma-separated), `location?` (substring match), `therapist?` (substring match), `limit?` (default 500, max 2000), `offset?` (default 0)

**Response:**
```json
{
  "entries": [AgendaEntry, ...],
  "count": 234,
  "params": { "start": "2026-06-01", "end": "2026-06-07" }
}
```

**SQL:** Select from `silver.hci_time_entry` with date range, activity filter, optional type/location/therapist filters. Map rows to `AgendaEntry` (compute `endTime` from `startTime + duration`). Order by `datum, tijd`. Apply LIMIT/OFFSET.

**CORS:** Add `Access-Control-Allow-Origin: *` header (UI may be on different port).

---

### 2. GET /api/agenda/stats

**Params:** `start` (date), `end` (date)

**Response:**
```json
{
  "period": { "start": "2026-06-01", "end": "2026-06-30" },
  "totalEntries": 3456,
  "byType": {
    "behandeling": { "count": 2326, "avgDuration": 56, "withClient": 2326 },
    "intake": { "count": 48, "avgDuration": 120, "withClient": 0 },
    ...
  },
  "byMonth": [
    { "year": 2026, "month": 6, "total": 3456, "therapists": 78 }
  ]
}
```

**SQL:** Two queries in parallel:
1. GROUP BY activity_type → count, avg duration, count with client
2. GROUP BY year/month → total entries, distinct therapists

---

### 3. GET /api/agenda/locations

**Params:** none (returns last 6 months of location data)

**Response:**
```json
{
  "locations": [AgendaLocation, ...],
  "summary": {
    "physical": 7,
    "online": 20,
    "home": 2,
    "cities": ["Amsterdam", "Heerlen", "Nijmegen", "Rotterdam", "Utrecht", "Venray"],
    "totalLocations": 29
  }
}
```

**SQL:** SELECT DISTINCT locatie with COUNT, filtered to last 6 months. Classify each with `classifyLocation()`. Group summary by type.

---

### 4. GET /api/agenda/therapists

**Params:** `start` (date), `end` (date)

**Response:**
```json
{
  "therapists": [
    { "name": "Kolijn J.", "entryCount": 45, "activityTypes": ["behandeling", "intake"] },
    ...
  ],
  "count": 78
}
```

**SQL:** GROUP BY rb_naam with COUNT and ARRAY_AGG(DISTINCT activity_type).

---

## How the UI uses these routes

```typescript
const API_BASE = "http://localhost:3000/api/agenda";

// Week view: load entries for current week
const { entries } = await fetch(`${API_BASE}/entries?start=2026-06-01&end=2026-06-07`).then(r => r.json());

// Filtered view: only intakes in Utrecht
const { entries: intakes } = await fetch(`${API_BASE}/entries?start=2026-06-01&end=2026-06-30&types=intake&location=Utrecht`).then(r => r.json());

// Dashboard header stats
const stats = await fetch(`${API_BASE}/stats?start=2026-06-01&end=2026-06-30`).then(r => r.json());

// Filter sidebar: load locations + therapists
const [locations, therapists] = await Promise.all([
  fetch(`${API_BASE}/locations`).then(r => r.json()),
  fetch(`${API_BASE}/therapists?start=2026-06-01&end=2026-06-30`).then(r => r.json()),
]);
```

## Mock data fallback

If the database is unreachable, fall back to the mock data in `docs/agenda-mock-data.ts` (52 entries for Jun 1-3, 2026). The mock data uses the exact same `AgendaEntry` type shape, so the UI can swap between mock and live seamlessly.

## Validation

Use Zod to validate all query params. Return 400 with error details for invalid input. Return 500 with generic error for database failures.

## Data volume expectations

| Date range | Approx entries returned |
|---|---|
| 1 day | ~200-400 |
| 1 week (Mon-Fri) | ~1,000-2,000 |
| 1 month | ~5,000-6,000 |

Set default limit to 500, max 2000. For week views the UI will typically get all entries in one call. For month views it should paginate.
