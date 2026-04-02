# Agenda Calendar — UI Implementation Prompt

Use the mock data in `docs/agenda-mock-data.ts` to build a therapist agenda/calendar view for an admin dashboard of a Dutch mental health SaaS platform (Moods AI).

## Data

Import everything from `agenda-mock-data.ts`:

- `mockAgendaEntries` — 52 real entries across 3 days (Jun 1-3, 2026)
- `mockLocations` — 7 physical + 7 online + 3 other locations with usage counts
- `mockAgendaStats` — summary stats for dashboard cards
- `LIVE_AGENDA_QUERY` — SQL query for switching to real database data later

### Entry shape

```typescript
type AgendaEntry = {
  id: string;
  date: string;                    // "2026-06-01"
  startTime: string;               // "09:00"
  endTime: string;                 // "10:00"
  duration: number;                // minutes
  activityType: "behandeling" | "workshop" | "diagnostiek" | "evaluatie" | "intake" | "reserved";
  therapistName: string;           // "Kate Starmans"
  clientName: string | null;       // null = open/unbooked slot
  status: string | null;           // "Ja" = confirmed
  location: string;                // "locatie Utrecht" or "Online behandelkamer Kate"
  description: string;             // free text, sometimes empty
};
```

## Activity types and how to display them

| Type | Color | Icon idea | Duration | Has client? | What it is |
|------|-------|-----------|----------|-------------|------------|
| `behandeling` | Sage/green | Person | 45-60 min | Yes (confirmed) | 1-on-1 treatment session |
| `workshop` | Purple/violet | Users/group | 90 min | Yes (group, multiple names) | Group therapy (e.g. "Brein in balans") |
| `diagnostiek` | Amber/orange | Clipboard | 45-130 min | Yes | Diagnostic assessment or feedback |
| `evaluatie` | Blue | MessageSquare | 45 min | Yes | Evaluation meeting (often 2 therapists + client) |
| `intake` | Teal/emerald | CalendarPlus | 120 min | No (open slot!) | Available intake appointment — highlight these |
| `reserved` | Gray/muted | Clock | 60-180 min | No | Time reserved for planning, not yet booked |

## Filters (left sidebar or top bar)

### Activity type filter
Checkboxes for each of the 6 types. All on by default. Show count badge per type.

### Location filter
Group locations by type:
- **Physical** (show city): Amsterdam, Utrecht, Rotterdam, Nijmegen, Heerlen, Venray
- **Online** (group as one toggle or expandable): "Online behandelkamers"
- **Home**: "Thuis / Bij client thuis"

Use the `mockLocations` array. Filter by matching `entry.location` against selected locations.

### Therapist filter
Extract unique therapist names from entries. Searchable dropdown or multi-select.

### Date range
Week view as default. Navigation arrows to go prev/next week. Option to switch to day view.

## Layout

### Week view (default)
- 5 columns (Mon-Fri), no weekends in the data
- Time axis from 08:00-17:00 on the left
- Entries as colored blocks positioned by startTime/endTime
- Overlapping entries stack horizontally (multiple therapists at same time)
- Intake slots should visually stand out (dashed border? brighter color? "Available" badge?)

### Day view
- Single column, more detail per entry
- Show therapist avatar placeholder, client name, location, description

### Entry card (on the calendar)
```
┌─────────────────────────────┐
│ 🟢 Behandeling        09:00 │
│ Rosie Ungheretti            │
│ Cauthen TY                  │
│ 📍 Online behandelkamer     │
└─────────────────────────────┘
```

For intakes (open slots), make them visually distinct:
```
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐
  🟩 Intake available   09:30
  Kate Starmans
  NL/EN · Utrecht
  [Book intake →]
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘
```

### Stats bar (top of page)
Use `mockAgendaStats` to show quick numbers:
- Total appointments this period
- Breakdown by type (small colored dots + count)
- Monthly volume trend (Apr → May → Jun)

## Design requirements

- Warm, earthy health-tech palette (cream/sage/tan backgrounds, not dark or clinical white)
- Sentence case for all UI text ("Treatment session", not "Treatment Session")
- Dutch context: therapist names, location names, and descriptions are in Dutch — don't translate them
- Client names use Dutch format: "Surname Initials" (e.g. "Kuling M.L.")
- Workshops show multiple client names separated by " / "

## Switching to live database data

The file includes `LIVE_AGENDA_QUERY` — a SQL query against `silver.hci_time_entry` that returns the same shape. When ready to connect to the real database:

```
Connection: postgres://beheerder:***@78.47.198.247:5999/postgres
Schema: silver
Table: silver.hci_time_entry
Organization ID: ec45b04e-9191-4e6c-83dc-f20d321be5ef
```

The query takes 3 parameters: `organizationId`, `startDate`, `endDate`. Map the `activity_type` CASE output to the same `AgendaActivityType` union. Compute `endTime` from `start_time + duration`.

## Data patterns to design for

- **Busiest days**: Tuesday (Jun 2 has 7 intakes + treatments + workshops + diagnostiek)
- **Overlapping entries**: Multiple therapists at the same time slot
- **Morning block** (08:00-12:30) and **afternoon block** (13:00-17:00)
- **Workshops have group clients**: One entry, multiple client names
- **Evaluaties often have 2 therapists**: Same client, same time, two entries (Rb + UB)
- **Reserved slots are large blocks**: Some are 3+ hours (planning reserves)
- **Intakes are always 120 min** and never have a client (they're open)
- **No Friday/Saturday/Sunday data** in this dataset
