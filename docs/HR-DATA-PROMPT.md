# HR & Verlof Data — API Implementation Prompt

Build API routes that serve HR employee data, sick leave, time off, contracts, and availability from a PostgreSQL database. These power the "Team" and "HR & Verlof" tabs in the admin dashboard.

## Database

```
Connection: postgres://beheerder:Fhxf01ACYHQ4DB3flFNLHb3afISSfAInFtbUcNw8GPPgI4JUg4AFTBh9vmwaw32W@78.47.198.247:5999/postgres
Schema: public
Organization ID: ec45b04e-9191-4e6c-83dc-f20d321be5ef
```

Use `pg` (node-postgres) directly. All queries must filter by `organization_id`.

---

## Tables & Key Columns

### hr_employee (160 rows, 100 active)
The core employee record. Links to locatie, team, functie.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `organization_id` | uuid | Tenant filter |
| `first_name` | text | |
| `last_name` | text | Sometimes empty (full name in first_name) |
| `email` | text | @ohmymood.com |
| `function` | text | "GZ-psycholoog", "Master Psycholoog", "Psychiater", "ZZP", etc. |
| `is_active` | bool | |
| `contract_type` | text | "Bepaalde tijd", "Onbepaalde tijd", "vast", "tijdelijk", or null (ZZP) |
| `contract_start_date` | date | |
| `contract_end_date` | date | null = permanent |
| `locatie_id` | uuid | FK → hr_locatie |
| `team_id` | uuid | FK → hr_team |
| `functie_id` | uuid | FK → hr_functie |
| `hooray_id` | int | Links to hooray_user |
| `member_id` | uuid | Links to platform member account |
| `code` | text | Short code |
| `hci_rb_naam` | text | HCI agenda name |

### hr_locatie (8 rows)

| naam |
|------|
| Amsterdam |
| Utrecht ASW |
| Utrecht DTL |
| Rotterdam |
| Nijmegen |
| Maastricht |
| Heerlen |
| Venray |

### hr_team (7 rows)

Amsterdam 1, Amsterdam 2, Amsterdam 3, Maastricht, Nijmegen, Rotterdam, Utrecht

### hr_functie (6 rows)
Role types with declarability targets.

| code | doelstelling_procent |
|------|---------------------|
| Leefstijlarts | 73% |
| PIOG | 65% |
| Psychiater | 65% |
| RB (regiebehandelaar) | 65% |
| TC (therapeut/coach) | 65% |
| UB (uitvoerend behandelaar) | 73% |

### hooray_user (158 rows)
Full Hooray HR profiles with personal details.

| Column | Type | Notes |
|--------|------|-------|
| `hooray_id` | int | Hooray system ID (use for JOINs) |
| `first_name` | text | |
| `last_name` | text | |
| `email` | text | Work email |
| `job_title` | text | |
| `gender` | text | |
| `birthdate` | date | |
| `company_start_date` | date | |
| `company_end_date` | date | null = still employed |
| `phone` | text | |
| `city` | text | Employee's city |
| `status` | text | |

### hooray_time_off (3,821 rows — 3,590 approved)
Leave requests from Hooray.

| Column | Type | Notes |
|--------|------|-------|
| `hooray_user_id` | int | FK → hooray_user.hooray_id |
| `first_name`, `last_name` | text | Denormalized |
| `time_off_type` | text | "LEAVE", "OVERTIME_PAYOUT", "OVERTIME_TIME_OFF_IN_LIEU", "TRANSACTION_CORRECTION", "TRANSACTION_SPENT" |
| `base_time_off_type` | text | "LEAVE", "OVERTIME", "TRANSACTION" |
| `status` | int | 1=pending, 2=?, 3=approved, 4=declined, 5=? |
| `leave_unit` | text | "FULL_DAY", "HOURS", etc. |
| `start_date` | timestamptz | |
| `end_date` | timestamptz | |
| `budget_total` | numeric | Hours in budget |
| `notes` | text | Employee notes (e.g. "ouderschapsverlof") |

### hooray_sick_leave_dossier (574 rows)
One dossier per sick leave case.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `hooray_user_id` | int | FK → hooray_user.hooray_id |
| `first_name`, `last_name` | text | Denormalized |

### hooray_sick_leave_phase (1,222 rows)
Phases within a sick leave dossier (reported → partial recovery → full recovery).

| Column | Type | Notes |
|--------|------|-------|
| `dossier_id` | uuid | FK → hooray_sick_leave_dossier.id |
| `percentage` | int | 100 = fully sick, 50 = half recovered |
| `start_date` | timestamptz | Phase start |
| `expected_return` | timestamptz | Expected return date (often null) |
| `calculated_end_date` | timestamptz | null = still in this phase |
| `status` | text | "REPORTED_SICK", "RECOVERED", etc. |
| `notes` | text | |

### hooray_contract (310 rows)
Employment contracts.

| Column | Type | Notes |
|--------|------|-------|
| `hooray_user_id` | int | FK → hooray_user.hooray_id |
| `first_name`, `last_name` | text | Denormalized |
| `contract_type` | text | "Bepaalde tijd" (fixed), "Onbepaalde tijd" (permanent) |
| `start_date` | date | |
| `end_date` | date | null = permanent |
| `hours_per_week` | numeric | Often null |
| `fte` | numeric | Often null |
| `probation_end_date` | date | |
| `notice_period` | text | |

### hooray_availability (383 rows)
Weekly work schedule per employee.

| Column | Type | Notes |
|--------|------|-------|
| `hooray_user_id` | int | FK → hooray_user.hooray_id |
| `day_of_week` | int | 0=Sunday, 1=Monday, ... 6=Saturday |
| `start_time` | text | "09:00" |
| `end_time` | text | "17:00" |
| `type` | text | |

### hooray_employment_term_assignment (801 rows)
Salary and compensation entries.

| Column | Type | Notes |
|--------|------|-------|
| `hooray_user_id` | int | FK → hooray_user.hooray_id |
| `hooray_employment_term_id` | int | FK → hooray_employment_term.hooray_id |
| `start_date` | timestamptz | |
| `currency` | text | "EUR" |
| `value` | text | Numeric string (e.g. "2468") |
| `is_terminated` | bool | |
| `status` | text | "ACTIVE", "INACTIVE" |
| `note` | text | Often contains pay scale info: "functiegroep 40, schaal 40a, trede 3" |

### hooray_employment_term (15 rows)
Compensation type definitions.

| Column | Type | Notes |
|--------|------|-------|
| `hooray_id` | int | PK for JOINs |
| `name` | text | Term name |
| `unit` | text | "EUR", "HOURS", etc. |

---

## API Routes

### 1. GET /api/hr/employees

Returns all employees with their location, team, function, and contract info.

**Params:** `active?` (bool, default true), `locatie?`, `team?`, `function?`

**SQL:**
```sql
SELECT
  e.id, e.first_name, e.last_name, e.email, e.function,
  e.is_active, e.contract_type,
  e.contract_start_date::text, e.contract_end_date::text,
  e.code, e.hci_rb_naam,
  l.naam AS locatie,
  t.naam AS team,
  f.code AS functie_code,
  f.doelstelling_procent
FROM hr_employee e
LEFT JOIN hr_locatie l ON e.locatie_id = l.id
LEFT JOIN hr_team t ON e.team_id = t.id
LEFT JOIN hr_functie f ON e.functie_id = f.id
WHERE e.organization_id = $1
  AND e.is_active = $2
ORDER BY e.last_name, e.first_name
```

**Response shape:**
```typescript
type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  function: string | null;       // "GZ-psycholoog", "Master Psycholoog"
  isActive: boolean;
  contractType: string | null;   // "Bepaalde tijd", "Onbepaalde tijd"
  contractStart: string | null;  // "2025-10-01"
  contractEnd: string | null;    // null = permanent
  locatie: string | null;        // "Amsterdam"
  team: string | null;           // "Amsterdam 2"
  functieCode: string | null;    // "RB", "UB", "TC"
  doelstellingProcent: number | null; // 65 or 73
};
```

---

### 2. GET /api/hr/sick-leave

Returns sick leave dossiers with their phases.

**Params:** `active?` (bool — active = has a phase with no calculated_end_date)

**SQL:**
```sql
SELECT
  d.id AS dossier_id,
  d.first_name, d.last_name,
  p.percentage,
  p.start_date::text AS phase_start,
  p.expected_return::text AS expected_return,
  p.calculated_end_date::text AS phase_end,
  p.status,
  p.notes
FROM hooray_sick_leave_dossier d
JOIN hooray_sick_leave_phase p ON p.dossier_id = d.id
WHERE d.organization_id = $1
ORDER BY p.start_date DESC
```

**Response shape:**
```typescript
type SickLeaveEntry = {
  dossierId: string;
  firstName: string;
  lastName: string;
  percentage: number;            // 100 = fully sick
  phaseStart: string;
  expectedReturn: string | null;
  phaseEnd: string | null;       // null = still sick
  status: string;                // "REPORTED_SICK", "RECOVERED"
  notes: string | null;
};
```

For the dashboard, highlight entries where `phaseEnd IS NULL` — these are currently sick employees.

---

### 3. GET /api/hr/time-off

Returns approved leave entries.

**Params:** `start` (date), `end` (date), `type?` ("LEAVE" | "OVERTIME" | "TRANSACTION")

**SQL:**
```sql
SELECT
  first_name, last_name,
  time_off_type, base_time_off_type,
  start_date::text, end_date::text,
  leave_unit, budget_total, notes, status
FROM hooray_time_off
WHERE organization_id = $1
  AND status = 3
  AND start_date >= $2 AND start_date <= $3
ORDER BY start_date DESC
```

**Response shape:**
```typescript
type TimeOffEntry = {
  firstName: string;
  lastName: string;
  type: string;                  // "LEAVE", "OVERTIME_PAYOUT", etc.
  baseType: string;              // "LEAVE", "OVERTIME", "TRANSACTION"
  startDate: string;
  endDate: string;
  leaveUnit: string;             // "FULL_DAY", "HOURS"
  budgetTotal: number | null;
  notes: string | null;
};
```

---

### 4. GET /api/hr/contracts

Returns contracts, especially useful for expiring-soon alerts.

**Params:** `expiring_before?` (date — show contracts ending before this date)

**SQL:**
```sql
SELECT
  first_name, last_name,
  contract_type,
  start_date::text, end_date::text,
  hours_per_week, fte,
  probation_end_date::text, notice_period
FROM hooray_contract
WHERE organization_id = $1
ORDER BY end_date ASC NULLS LAST
```

---

### 5. GET /api/hr/availability

Returns weekly work schedules per employee.

**SQL:**
```sql
SELECT
  hu.first_name, hu.last_name,
  ha.day_of_week, ha.start_time, ha.end_time, ha.type
FROM hooray_availability ha
JOIN hooray_user hu ON ha.hooray_user_id = hu.hooray_id
WHERE ha.organization_id = $1
ORDER BY hu.last_name, ha.day_of_week
```

**Response shape:**
```typescript
type AvailabilityEntry = {
  firstName: string;
  lastName: string;
  dayOfWeek: number;             // 0=Sun, 1=Mon, ... 6=Sat
  startTime: string;             // "09:00"
  endTime: string;               // "17:00"
  type: string;
};
```

---

### 6. GET /api/hr/reference-data

Returns all filter options (locaties, teams, functies) in one call.

**SQL:** Three simple queries in parallel.

**Response:**
```json
{
  "locaties": ["Amsterdam", "Heerlen", "Maastricht", "Nijmegen", "Rotterdam", "Utrecht ASW", "Utrecht DTL", "Venray"],
  "teams": ["Amsterdam 1", "Amsterdam 2", "Amsterdam 3", "Maastricht", "Nijmegen", "Rotterdam", "Utrecht"],
  "functies": [
    { "code": "Leefstijlarts", "doelstellingProcent": 73 },
    { "code": "PIOG", "doelstellingProcent": 65 },
    { "code": "Psychiater", "doelstellingProcent": 65 },
    { "code": "RB", "doelstellingProcent": 65 },
    { "code": "TC", "doelstellingProcent": 65 },
    { "code": "UB", "doelstellingProcent": 73 }
  ]
}
```

---

### 7. GET /api/hr/stats

Summary dashboard stats.

**SQL:**
```sql
SELECT
  (SELECT COUNT(*)::int FROM hr_employee WHERE organization_id = $1 AND is_active = true) AS active_employees,
  (SELECT COUNT(*)::int FROM hr_employee WHERE organization_id = $1 AND is_active = false) AS inactive_employees,
  (SELECT COUNT(*)::int FROM hooray_sick_leave_phase p
    JOIN hooray_sick_leave_dossier d ON p.dossier_id = d.id
    WHERE d.organization_id = $1 AND p.calculated_end_date IS NULL
  ) AS currently_sick,
  (SELECT COUNT(*)::int FROM hooray_time_off
    WHERE organization_id = $1 AND status = 3
      AND start_date <= NOW() AND end_date >= NOW()
  ) AS on_leave_today,
  (SELECT COUNT(*)::int FROM hooray_contract
    WHERE organization_id = $1
      AND end_date IS NOT NULL
      AND end_date <= NOW() + INTERVAL '90 days'
      AND end_date >= NOW()
  ) AS contracts_expiring_90d
```

**Response:**
```typescript
type HrStats = {
  activeEmployees: number;       // 100
  inactiveEmployees: number;     // 60
  currentlySick: number;         // employees in active sick phase
  onLeaveToday: number;          // approved leave overlapping today
  contractsExpiring90d: number;  // contracts ending within 90 days
};
```

---

## CORS

Add `Access-Control-Allow-Origin: *` to all responses (UI may run on different port).

## Dutch Context

- Contract types: "Bepaalde tijd" (fixed-term), "Onbepaalde tijd" (permanent), "vast" (permanent), "tijdelijk" (temporary)
- Function names: Dutch job titles, don't translate
- Leave notes: Dutch (e.g. "ouderschapsverlof op donderdag")
- Status 3 = approved in Hooray's system
- `doelstelling_procent` = declarability target percentage per role
