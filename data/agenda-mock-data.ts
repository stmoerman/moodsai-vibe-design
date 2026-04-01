// =============================================================================
// Agenda Mock Data — based on real HCI data from silver.hci_time_entry
// Source: PostgreSQL on Azure, June 1-3 2026, Report 56
// =============================================================================

// --- Types -------------------------------------------------------------------

export type AgendaActivityType =
	| "behandeling" // Treatment session (zpm behandeling)
	| "workshop" // Group workshop (zpm1040)
	| "diagnostiek" // Diagnostic assessment (zpm diagnostiek)
	| "evaluatie" // Evaluation meeting (evaluatiegesprek rb)
	| "intake" // Open intake slot (optie intake nl / 300)
	| "reserved"; // Reserved for planning (gereserveerd t.b.v. afspraakplanning hv)

export type AgendaEntry = {
	id: string;
	date: string; // ISO YYYY-MM-DD
	startTime: string; // HH:mm
	endTime: string; // HH:mm (computed from startTime + duration)
	duration: number; // minutes
	activityType: AgendaActivityType;
	therapistName: string;
	clientName: string | null; // null = open/unbooked slot
	status: string | null; // "Ja" = confirmed, null = unconfirmed/open
	location: string;
	description: string;
};

// --- Locations ---------------------------------------------------------------

export type LocationType = "physical" | "online" | "home" | "phone";

export type AgendaLocation = {
	name: string;
	type: LocationType;
	city: string | null;
	entryCount: number; // how many entries in Apr-Jun 2026
};

export const mockLocations: AgendaLocation[] = [
	// Physical locations
	{
		name: "locatie Amsterdam Overschiestraat (nieu)",
		type: "physical",
		city: "Amsterdam",
		entryCount: 11954,
	},
	{
		name: "locatie Utrecht",
		type: "physical",
		city: "Utrecht",
		entryCount: 3144,
	},
	{
		name: "Locatie Rotterdam (nieuw)",
		type: "physical",
		city: "Rotterdam",
		entryCount: 2125,
	},
	{
		name: "Locatie Nijmegen (nieuw)",
		type: "physical",
		city: "Nijmegen",
		entryCount: 1480,
	},
	{
		name: "locatie Heerlen",
		type: "physical",
		city: "Heerlen",
		entryCount: 870,
	},
	{
		name: "Locatie Utrecht Daltonlaan",
		type: "physical",
		city: "Utrecht",
		entryCount: 832,
	},
	{
		name: "locatie Venray",
		type: "physical",
		city: "Venray",
		entryCount: 234,
	},
	// Online rooms (per therapist)
	{
		name: "Online behandelkamer Kate",
		type: "online",
		city: null,
		entryCount: 0,
	},
	{
		name: "Online behandelkamer Juliette",
		type: "online",
		city: null,
		entryCount: 0,
	},
	{
		name: "Online behandelkamer Rosie",
		type: "online",
		city: null,
		entryCount: 993,
	},
	{
		name: "Online behandelkamer Rebekka",
		type: "online",
		city: null,
		entryCount: 1073,
	},
	{
		name: "Online behandelkamer Anne Hoetink",
		type: "online",
		city: null,
		entryCount: 1072,
	},
	{
		name: "Online behandelkamer Tanita",
		type: "online",
		city: null,
		entryCount: 786,
	},
	{
		name: "Online behandelkamer Gabriela",
		type: "online",
		city: null,
		entryCount: 733,
	},
	// Other
	{
		name: "Thuis (adres...)",
		type: "home",
		city: null,
		entryCount: 2068,
	},
	{
		name: "Bij client thuis",
		type: "home",
		city: null,
		entryCount: 186,
	},
	{
		name: "Telefonisch contact",
		type: "phone",
		city: null,
		entryCount: 4,
	},
];

// --- Helper ------------------------------------------------------------------

function endTime(start: string, durationMin: number): string {
	const [h, m] = start.split(":").map(Number);
	const total = h * 60 + m + durationMin;
	return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

// --- Mock Entries (Jun 1-3 2026, real data from silver.hci_time_entry) --------

export const mockAgendaEntries: AgendaEntry[] = [
	// ===== JUNE 1 (Monday) =====

	// -- Reserved for planning --
	{
		id: "r-001",
		date: "2026-06-01",
		startTime: "08:30",
		endTime: endTime("08:30", 60),
		duration: 60,
		activityType: "reserved",
		therapistName: "Eelke Sistermans",
		clientName: null,
		status: null,
		location: "Online behandelkamer Eelke",
		description: "Eelke optie behandelcontact NL online",
	},
	{
		id: "r-002",
		date: "2026-06-01",
		startTime: "08:30",
		endTime: endTime("08:30", 60),
		duration: 60,
		activityType: "reserved",
		therapistName: "Gabriela Hinsenveld",
		clientName: null,
		status: null,
		location: "Online behandelkamer Gabriela",
		description:
			"Gabriela optie behandelcontact (NL/EN/Spaans) online",
	},
	{
		id: "r-003",
		date: "2026-06-01",
		startTime: "08:45",
		endTime: endTime("08:45", 60),
		duration: 60,
		activityType: "reserved",
		therapistName: "Pim Piepers",
		clientName: null,
		status: null,
		location: "locatie Utrecht",
		description: "Pim optie behandelcontact NL/EN f2f/online",
	},

	// -- Behandeling --
	{
		id: "b-001",
		date: "2026-06-01",
		startTime: "09:00",
		endTime: endTime("09:00", 60),
		duration: 60,
		activityType: "behandeling",
		therapistName: "Merel Kraan",
		clientName: "Nieuwenhuis E.M.",
		status: "Ja",
		location: "locatie Utrecht",
		description: "",
	},
	{
		id: "b-002",
		date: "2026-06-01",
		startTime: "09:15",
		endTime: endTime("09:15", 45),
		duration: 45,
		activityType: "behandeling",
		therapistName: "Olaf Bleijenberg",
		clientName: "Kuling M.L.",
		status: "Ja",
		location: "online behandelkamer Olaf",
		description: "online: ev na 2 mnd pmss",
	},
	{
		id: "b-003",
		date: "2026-06-01",
		startTime: "09:15",
		endTime: endTime("09:15", 60),
		duration: 60,
		activityType: "behandeling",
		therapistName: "Rosie Ungheretti",
		clientName: "Verhees-Hoeks M.C.M.",
		status: "Ja",
		location: "Online behandelkamer Rosie",
		description: "",
	},
	{
		id: "b-004",
		date: "2026-06-01",
		startTime: "09:30",
		endTime: endTime("09:30", 60),
		duration: 60,
		activityType: "behandeling",
		therapistName: "Simone Biersteker",
		clientName: "Lens E.J.M.C.",
		status: "Ja",
		location: "Online behandelkamer Simone Biersteker",
		description: "10/10",
	},

	// -- Intake (open slots) --
	{
		id: "i-001",
		date: "2026-06-01",
		startTime: "09:30",
		endTime: endTime("09:30", 120),
		duration: 120,
		activityType: "intake",
		therapistName: "Kate Starmans",
		clientName: null,
		status: null,
		location: "Online behandelkamer Kate",
		description:
			"Kate optie intake (NL/EN) - Valentine sluit 11:00 aan - Utrecht",
	},
	{
		id: "i-002",
		date: "2026-06-01",
		startTime: "13:30",
		endTime: endTime("13:30", 120),
		duration: 120,
		activityType: "intake",
		therapistName: "Juliette Kolijn",
		clientName: null,
		status: null,
		location: "Online behandelkamer Juliette",
		description:
			"Juliette optie intake (NL) - Valentine sluit 15:00 aan",
	},
	{
		id: "i-003",
		date: "2026-06-01",
		startTime: "13:30",
		endTime: endTime("13:30", 120),
		duration: 120,
		activityType: "intake",
		therapistName: "Anne Stam",
		clientName: null,
		status: null,
		location: "online behandelkamer Anne Stam",
		description:
			"Anne optie intake (NL) - Lisa sluit 15:00 aan - Rotterdam",
	},
	{
		id: "i-004",
		date: "2026-06-01",
		startTime: "14:00",
		endTime: endTime("14:00", 120),
		duration: 120,
		activityType: "intake",
		therapistName: "Sandy Gouder de Beauregard",
		clientName: null,
		status: null,
		location: "online behandelkamer Sandy",
		description:
			"Sandy optie intake (NL) - Suzanne sluit 15:30 aan - Limburg",
	},

	// -- Workshop --
	{
		id: "w-001",
		date: "2026-06-01",
		startTime: "13:00",
		endTime: endTime("13:00", 90),
		duration: 90,
		activityType: "workshop",
		therapistName: "Kate Starmans",
		clientName: "Azdad F. / Oosterom M.C. / Bruijn E.A.A. de",
		status: "Ja",
		location: "Online behandelkamer Kate",
		description: "Brein in balans 5/6",
	},

	// ===== JUNE 2 (Tuesday) =====

	// -- Reserved --
	{
		id: "r-004",
		date: "2026-06-02",
		startTime: "08:00",
		endTime: endTime("08:00", 60),
		duration: 60,
		activityType: "reserved",
		therapistName: "Tanita Swinkels",
		clientName: null,
		status: null,
		location: "Online behandelkamer Tanita",
		description: "Tanita optie behandelcontact eigen cl",
	},
	{
		id: "r-005",
		date: "2026-06-02",
		startTime: "08:30",
		endTime: endTime("08:30", 180),
		duration: 180,
		activityType: "reserved",
		therapistName: "Suzanne Holthuijsen",
		clientName: null,
		status: null,
		location: "online behandelkamer Suzanne",
		description:
			"(online) Tijd voor clienten (eigen/ nieuw/ evaluatie/ eindgesprek/ diagnostiek terugkoppeling)",
	},

	// -- Intake --
	{
		id: "i-005",
		date: "2026-06-02",
		startTime: "08:30",
		endTime: endTime("08:30", 120),
		duration: 120,
		activityType: "intake",
		therapistName: "Juliette Kolijn",
		clientName: null,
		status: null,
		location: "Online behandelkamer Juliette",
		description:
			"Juliette optie intake (NL) - Julia sluit 10:00 aan - Utrecht",
	},
	{
		id: "i-006",
		date: "2026-06-02",
		startTime: "10:00",
		endTime: endTime("10:00", 120),
		duration: 120,
		activityType: "intake",
		therapistName: "Mirthe Keizer",
		clientName: null,
		status: null,
		location: "Online behandelkamer Mirthe",
		description:
			"Mirthe optie intake (NL) - Suzanne sluit 11:30 aan - Limburg",
	},
	{
		id: "i-007",
		date: "2026-06-02",
		startTime: "10:00",
		endTime: endTime("10:00", 120),
		duration: 120,
		activityType: "intake",
		therapistName: "Angela van der Helm",
		clientName: null,
		status: null,
		location: "Online behandelkamer Angela",
		description:
			"Angela optie intake (NL/EN) - Kaisa sluit 11:30 aan",
	},
	{
		id: "i-008",
		date: "2026-06-02",
		startTime: "13:30",
		endTime: endTime("13:30", 120),
		duration: 120,
		activityType: "intake",
		therapistName: "Merel Kraan",
		clientName: null,
		status: null,
		location: "Online behandelkamer Merel",
		description:
			"Merel optie intake (NL) - Yasemin sluit 15:00 aan - Utrecht",
	},
	{
		id: "i-009",
		date: "2026-06-02",
		startTime: "14:00",
		endTime: endTime("14:00", 120),
		duration: 120,
		activityType: "intake",
		therapistName: "Eline Nelissen",
		clientName: null,
		status: null,
		location: "Online behandelkamer Eline",
		description:
			"Eline optie intake (NL) - Simone sluit 15:30 aan - Amsterdam",
	},
	{
		id: "i-010",
		date: "2026-06-02",
		startTime: "14:30",
		endTime: endTime("14:30", 120),
		duration: 120,
		activityType: "intake",
		therapistName: "Lenny Appel",
		clientName: null,
		status: null,
		location: "Online behandelkamer Lenny",
		description:
			"Lenny optie intake (NL) - Suzanne sluit 16.00 aan - Amsterdam",
	},
	{
		id: "i-011",
		date: "2026-06-02",
		startTime: "15:00",
		endTime: endTime("15:00", 120),
		duration: 120,
		activityType: "intake",
		therapistName: "Lois Borger",
		clientName: null,
		status: null,
		location: "Online behandelkamer Lois",
		description: "Lois optie intake (NL/EN) - Mirjam sluit 16:30 aan",
	},

	// -- Behandeling --
	{
		id: "b-005",
		date: "2026-06-02",
		startTime: "09:00",
		endTime: endTime("09:00", 60),
		duration: 60,
		activityType: "behandeling",
		therapistName: "Lian Kolet",
		clientName: "Tavares (Lopes) S.",
		status: "Ja",
		location: "Locatie Rotterdam (nieuw)",
		description: "Sessie",
	},
	{
		id: "b-006",
		date: "2026-06-02",
		startTime: "09:00",
		endTime: endTime("09:00", 60),
		duration: 60,
		activityType: "behandeling",
		therapistName: "Anne Hoetink",
		clientName: "Immerzeel I. van",
		status: "Ja",
		location: "Online behandelkamer Anne Hoetink",
		description: "sessie 7",
	},
	{
		id: "b-007",
		date: "2026-06-02",
		startTime: "10:00",
		endTime: endTime("10:00", 60),
		duration: 60,
		activityType: "behandeling",
		therapistName: "Tisja Daamen",
		clientName: "Koning L.B.",
		status: "Ja",
		location: "locatie Amsterdam Overschiestraat (nieu)",
		description: "BEVESTIGD",
	},
	{
		id: "b-008",
		date: "2026-06-02",
		startTime: "10:00",
		endTime: endTime("10:00", 60),
		duration: 60,
		activityType: "behandeling",
		therapistName: "Lian Kolet",
		clientName: "Hasic A.",
		status: "Ja",
		location: "Locatie Rotterdam (nieuw)",
		description: "15",
	},

	// -- Evaluatie --
	{
		id: "e-001",
		date: "2026-06-02",
		startTime: "11:00",
		endTime: endTime("11:00", 45),
		duration: 45,
		activityType: "evaluatie",
		therapistName: "Lian Kolet",
		clientName: "Hakkesteegt I",
		status: "Ja",
		location: "Locatie Rotterdam (nieuw)",
		description: "Evaluatie met Rb en UB op locatie",
	},
	{
		id: "e-002",
		date: "2026-06-02",
		startTime: "11:00",
		endTime: endTime("11:00", 45),
		duration: 45,
		activityType: "evaluatie",
		therapistName: "Anouk de Vries",
		clientName: "Hakkesteegt I",
		status: "Ja",
		location: "Locatie Rotterdam (nieuw)",
		description: "Evaluatie met Rb en UB op locatie",
	},

	// -- Workshop --
	{
		id: "w-002",
		date: "2026-06-02",
		startTime: "14:00",
		endTime: endTime("14:00", 90),
		duration: 90,
		activityType: "workshop",
		therapistName: "Gabriela Hinsenveld",
		clientName: "Jarema M.",
		status: "Ja",
		location: "Online behandelkamer Gabriela",
		description: "ACT workshop EN 4/6",
	},
	{
		id: "w-003",
		date: "2026-06-02",
		startTime: "14:00",
		endTime: endTime("14:00", 90),
		duration: 90,
		activityType: "workshop",
		therapistName: "Davis van de Ven",
		clientName:
			"Albada Jelgersma L.J.F. / Kersting L.K. / Mulder J.W.J.",
		status: "Ja",
		location: "Online behandelkamer Davis",
		description: "Brein in balans 6/6",
	},

	// -- Diagnostiek --
	{
		id: "d-001",
		date: "2026-06-02",
		startTime: "14:15",
		endTime: endTime("14:15", 45),
		duration: 45,
		activityType: "diagnostiek",
		therapistName: "Anne Hoetink",
		clientName: "Veltman M.",
		status: "Ja",
		location: "Online behandelkamer Tanita",
		description: "Terugkoppelgesprek met client",
	},
	{
		id: "d-002",
		date: "2026-06-02",
		startTime: "14:15",
		endTime: endTime("14:15", 45),
		duration: 45,
		activityType: "diagnostiek",
		therapistName: "Tanita Swinkels",
		clientName: "Veltman M.",
		status: "Ja",
		location: "Online behandelkamer Tanita",
		description: "Terugkoppelgesprek met client",
	},

	// ===== JUNE 3 (Wednesday) =====

	// -- Reserved --
	{
		id: "r-006",
		date: "2026-06-03",
		startTime: "08:00",
		endTime: endTime("08:00", 60),
		duration: 60,
		activityType: "reserved",
		therapistName: "Tanita Swinkels",
		clientName: null,
		status: null,
		location: "Online behandelkamer Tanita",
		description: "Tanita optie behandelcontact eigen cl",
	},
	{
		id: "r-007",
		date: "2026-06-03",
		startTime: "08:45",
		endTime: endTime("08:45", 130),
		duration: 130,
		activityType: "reserved",
		therapistName: "Marjolein Barink",
		clientName: null,
		status: null,
		location: "Online behandelkamer Marjolein",
		description: "Marjolein optie DIVA (NL)",
	},

	// -- Intake --
	{
		id: "i-012",
		date: "2026-06-03",
		startTime: "09:00",
		endTime: endTime("09:00", 120),
		duration: 120,
		activityType: "intake",
		therapistName: "Angenieta Zweerus",
		clientName: null,
		status: null,
		location: "Online behandelkamer Angenieta",
		description:
			"Angenieta intake (NL) - Kaisa sluit 10:30 aan - Amsterdam",
	},
	{
		id: "i-013",
		date: "2026-06-03",
		startTime: "09:30",
		endTime: endTime("09:30", 120),
		duration: 120,
		activityType: "intake",
		therapistName: "Dieuwke Sevenster",
		clientName: null,
		status: null,
		location: "Online behandelkamer Dieuwke",
		description:
			"Dieuwke optie intake (NL/EN) - Chiara sluit 11:00 aan - Amsterdam",
	},
	{
		id: "i-014",
		date: "2026-06-03",
		startTime: "10:00",
		endTime: endTime("10:00", 120),
		duration: 120,
		activityType: "intake",
		therapistName: "Thomas Visser",
		clientName: null,
		status: null,
		location: "Online behandelkamer Thomas",
		description:
			"Thomas optie intake (NL/EN) - Giada sluit 11:30 aan - Amsterdam",
	},
	{
		id: "i-015",
		date: "2026-06-03",
		startTime: "13:30",
		endTime: endTime("13:30", 120),
		duration: 120,
		activityType: "intake",
		therapistName: "Rebekka Folkers",
		clientName: null,
		status: null,
		location: "Online behandelkamer Rebekka",
		description:
			"Rebekka optie intake (NL) - Maxime sluit 15:00 aan - Amsterdam",
	},
	{
		id: "i-016",
		date: "2026-06-03",
		startTime: "13:45",
		endTime: endTime("13:45", 120),
		duration: 120,
		activityType: "intake",
		therapistName: "Anne Hoetink",
		clientName: null,
		status: null,
		location: "Online behandelkamer Anne Hoetink",
		description:
			"Anne Hoetink optie intake (NL) - Tanita sluit 15:15 aan - Nijmegen",
	},

	// -- Workshop --
	{
		id: "w-004",
		date: "2026-06-03",
		startTime: "09:00",
		endTime: endTime("09:00", 90),
		duration: 90,
		activityType: "workshop",
		therapistName: "Rebekka Folkers",
		clientName: "Os - van den Akker E.E. van / Vroegop L.G.",
		status: "Ja",
		location: "Online behandelkamer Rebekka",
		description: "Brein in balans 2/6",
	},

	// -- Behandeling --
	{
		id: "b-009",
		date: "2026-06-03",
		startTime: "09:15",
		endTime: endTime("09:15", 60),
		duration: 60,
		activityType: "behandeling",
		therapistName: "Rosie Ungheretti",
		clientName: "Martins - Post M.I.J.",
		status: "Ja",
		location: "Online behandelkamer Rosie",
		description: "",
	},
	{
		id: "b-010",
		date: "2026-06-03",
		startTime: "10:00",
		endTime: endTime("10:00", 60),
		duration: 60,
		activityType: "behandeling",
		therapistName: "Ruud Koolen",
		clientName: "Gero S.B.",
		status: "Ja",
		location: "locatie Heerlen",
		description: "Session 18",
	},
	{
		id: "b-011",
		date: "2026-06-03",
		startTime: "10:15",
		endTime: endTime("10:15", 60),
		duration: 60,
		activityType: "behandeling",
		therapistName: "Rosie Ungheretti",
		clientName: "Cauthen TY",
		status: "Ja",
		location: "Online behandelkamer Rosie",
		description: "",
	},
	{
		id: "b-012",
		date: "2026-06-03",
		startTime: "11:30",
		endTime: endTime("11:30", 60),
		duration: 60,
		activityType: "behandeling",
		therapistName: "Rosie Ungheretti",
		clientName: "Sachdeva S.S.",
		status: "Ja",
		location: "Online behandelkamer Rosie",
		description: "",
	},
];

// --- Statistics (for dashboard cards) ----------------------------------------

export const mockAgendaStats = {
	period: "2026-06-01 to 2026-06-03",
	totalEntries: 52,
	byType: {
		behandeling: { count: 8, avgDuration: 58, withClient: 8 },
		workshop: { count: 4, avgDuration: 90, withClient: 4 },
		diagnostiek: { count: 2, avgDuration: 45, withClient: 2 },
		evaluatie: { count: 2, avgDuration: 45, withClient: 2 },
		intake: { count: 16, avgDuration: 120, withClient: 0 },
		reserved: { count: 7, avgDuration: 96, withClient: 0 },
	},
	monthlyVolume: {
		april: { total: 21602, therapists: 657, workingDays: 28 },
		may: { total: 16554, therapists: 489, workingDays: 23 },
		june: { total: 17834, therapists: 378, workingDays: 25 },
	},
};

// --- Database query for live data --------------------------------------------

/**
 * SQL query to fetch agenda entries from the real database.
 * Connects to: silver.hci_time_entry (Report 56)
 *
 * Usage: replace $1-$3 with organizationId, startDate, endDate
 */
export const LIVE_AGENDA_QUERY = `
  SELECT
    id,
    datum::text                          AS date,
    tijd                                 AS start_time,
    direct_duur                          AS duration,
    rb_naam                              AS therapist,
    r56_client_naam                      AS client_name,
    r56_status_omschr                    AS status,
    locatie                              AS location,
    omschrijving                         AS description,
    CASE
      WHEN activiteit_type ILIKE '%behandeling%' OR activiteit_type = 'zpm1010' THEN 'behandeling'
      WHEN activiteit_type ILIKE '%workshop%'    OR activiteit_type = 'zpm1040' THEN 'workshop'
      WHEN activiteit_type ILIKE '%diagnostiek%' OR activiteit_type = 'zpm1001' THEN 'diagnostiek'
      WHEN activiteit_type ILIKE '%evaluatie%'   OR activiteit_type = 'zpm1070' THEN 'evaluatie'
      WHEN activiteit_type ILIKE '%intake%'      OR activiteit_type LIKE '300%' THEN 'intake'
      WHEN activiteit_type ILIKE '%gereserveerd%'                               THEN 'reserved'
      ELSE 'other'
    END                                  AS activity_type
  FROM silver.hci_time_entry
  WHERE organization_id = $1
    AND report_id = 56
    AND datum >= $2 AND datum <= $3
    AND tijd IS NOT NULL AND tijd != ''
    AND (
      activiteit_type IN (
        'zpm behandeling', 'zpm diagnostiek', 'workshop',
        'evaluatiegesprek rb', 'optie intake nl',
        'gereserveerd t.b.v. afspraakplanning hv'
      )
      OR activiteit_type LIKE '300%'
      OR activiteit_type LIKE 'zpm1010%'
      OR activiteit_type LIKE 'zpm1001%'
      OR activiteit_type LIKE 'zpm1040%'
      OR activiteit_type LIKE 'zpm1070%'
    )
  ORDER BY datum, tijd
`;
