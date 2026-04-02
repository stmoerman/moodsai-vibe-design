# Moods AI — Database Schema Reference

**Connection:** `postgres://beheerder:***@78.47.198.247:5999/postgres`
**Schemas:** `silver`, `public` (no `gold` tables yet)

---

## Silver Schema

### `silver.hci_time_entry` (~1.2M rows, 1.6 GB)

The main agenda/scheduling table. Sourced from the HCI planning system. Contains all appointments, intake slots, workshops, diagnostiek, and reserved time blocks.

**Key columns:**

| Column | Type | Description |
|---|---|---|
| `id` | uuid | Primary key |
| `organization_id` | uuid | Multi-tenant filter. Ours: `ec45b04e-9191-4e6c-83dc-f20d321be5ef` |
| `report_id` | int | Use `56` for agenda data |
| `datum` | date | Appointment date |
| `tijd` | text | Start time "HH:mm" |
| `direct_duur` | float | Duration in minutes |
| `rb_naam` | text | Therapist display name (abbreviated: "Kolijn J.") |
| `activiteit_type` | text | Raw activity type (see mapping below) |
| `r56_client_naam` | text | Client name. `NULL` = open/unbooked slot |
| `r56_status_omschr` | text | "Ja" = confirmed, NULL = open |
| `locatie` | text | Location (physical address or "Online behandelkamer X") |
| `omschrijving` | text | Free-text description/notes. Often contains region info for intakes |

**Activity type mapping:**

| Raw value | Category | What it is |
|---|---|---|
| `zpm behandeling`, `zpm1010%` | `behandeling` | 1-on-1 treatment (45-60 min) |
| `workshop`, `zpm1040%` | `workshop` | Group therapy (90 min) |
| `zpm diagnostiek`, `zpm1001%` | `diagnostiek` | Diagnostic assessment (45-130 min) |
| `evaluatiegesprek rb`, `zpm1070%` | `evaluatie` | Evaluation meeting (45 min) |
| `optie intake nl`, `300%` | `intake` | Open intake slot (120 min, no client) |
| `gereserveerd%` | `reserved` | Reserved planning time |

**System accounts to filter out:** `Admin A`, `Workshops W`, `ADHD A`, `Intake I`, `RB Intake RB`, `Planning P`, `Dekker F`

**Open intake slots (next 6 months from today):**

| Month | Total | Utrecht | Amsterdam | Landelijk | Limburg | Nijmegen | Rotterdam |
|---|---|---|---|---|---|---|---|
| 2026-06 | 98 | 32 | 30 | 24 | 6 | 4 | 2 |
| 2026-07 | 74 | 32 | 24 | 18 | — | — | — |
| 2026-08 | 78 | 34 | 26 | 18 | — | — | — |
| 2026-09 | 76 | 32 | 28 | 16 | — | — | — |
| 2026-10 | 4 | 2 | — | 2 | — | — | — |

**Note:** No data before June 2026. This week (March 31 – April 4) only has 2 open intake slots on March 31.

---

## Public Schema — Key Tables

### `hr_employee` (160 rows, ~100 active)

HR employee records linked to Nmbrs payroll.

| Column | Type | Description |
|---|---|---|
| `id` | uuid | PK |
| `first_name`, `last_name` | text | Full name |
| `email` | text | Work email |
| `function` | text | Role: "Master Psycholoog", "GZ-psycholoog", "PioG", "Planner", etc. |
| `hci_rb_naam` | text | Maps to `silver.hci_time_entry.rb_naam` |
| `is_active` | boolean | Currently employed |
| `functie_id` | uuid | FK → `hr_functie` |
| `locatie_id` | uuid | FK → `hr_locatie` |
| `team_id` | uuid | FK → `hr_team` |
| `member_id` | uuid | FK → `member` |

**Active staff by function:** Master Psycholoog (28), GZ-psycholoog (20), PioG (9), stagiair (3), ZZP (3), Social Worker (2), Psychiater (2), Vaktherapeut (2), + admin/management roles

### `hr_locatie` (8 rows)

Physical office locations.

| Name | Type |
|---|---|
| Amsterdam | office |
| Utrecht ASW | office |
| Utrecht DTL | office |
| Rotterdam | office |
| Nijmegen | office |
| Heerlen | office |
| Maastricht | office |
| Venray | office |

### `hr_team` (7 rows)

Teams: Amsterdam 1, Amsterdam 2, Amsterdam 3, Maastricht, Nijmegen, Rotterdam, Utrecht

### `practitioner_mapping` (337 rows)

Links HCI agenda usernames to `hr_employee` records. Use `agenda_username` or `agenda_display_name` to match `silver.hci_time_entry.rb_naam`.

| Column | Description |
|---|---|
| `agenda_username` | HCI login name |
| `agenda_display_name` | Display name in HCI |
| `employee_id` | FK → `hr_employee.id` |
| `match_confidence` | How confident the auto-match is |
| `verified_at` | NULL = unverified |

### `invitation` (36 rows)

Sent invitations for platform onboarding.

| Column | Description |
|---|---|
| `email` | Invited email |
| `role` | Invited role |
| `status` | Pending/accepted/expired |
| `first_name`, `last_name` | Invitee name |

### `client_onboarding` (0 rows)

Client onboarding flow tracking. Has `stage`, `selected_intake_slot` (jsonb), `triage_decision`.

### `intake_request` (0 rows)

Intake slot bookings. Links to `client_onboarding` and stores `slot_date`, `slot_start_time`, `hci_therapist_name`, `status`.

### `appointment_request` (0 rows)

Generic appointment requests. Links client member → therapist member → HCI time entry.

### `leave_request` (2 rows)

Leave/absence requests with coach + HR review workflow.

### `member` (21 rows)

Organization members (staff accounts). Links `user_id` → `organization_id` with `role`.

### `organization` (1 row)

The Moods AI organization record.

---

## Useful Joins

**Therapist → Employee → Location:**
```sql
SELECT e.first_name, e.last_name, l.naam as location, t.naam as team
FROM hr_employee e
LEFT JOIN hr_locatie l ON l.id = e.locatie_id
LEFT JOIN hr_team t ON t.id = e.team_id
WHERE e.is_active = true AND e.function IN ('Master Psycholoog', 'GZ-psycholoog', 'PioG')
```

**Map HCI rb_naam → real name:**
```sql
SELECT pm.agenda_display_name, e.first_name, e.last_name, e.function
FROM practitioner_mapping pm
JOIN hr_employee e ON e.id = pm.employee_id
WHERE e.is_active = true
```
