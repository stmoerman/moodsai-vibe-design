export type AgendaActivityType =
  | 'behandeling'
  | 'workshop'
  | 'diagnostiek'
  | 'evaluatie'
  | 'intake'
  | 'reserved'
  | 'other';

export type LocationType = 'physical' | 'online' | 'home' | 'phone' | 'unknown';

export interface AgendaEntry {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  activityType: AgendaActivityType;
  therapistName: string;
  clientName: string | null;
  status: string | null;
  location: string;
  description: string;
}

export interface AgendaLocation {
  name: string;
  type: LocationType;
  city: string | null;
  entryCount: number;
}

export const ORG_ID = 'ec45b04e-9191-4e6c-83dc-f20d321be5ef';
export const REPORT_ID = 56;

export const BASE_WHERE = `
  organization_id = '${ORG_ID}'
  AND report_id = ${REPORT_ID}
  AND tijd IS NOT NULL AND tijd != ''
`;

export const ACTIVITY_FILTER = `
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
`;

export const ACTIVITY_TYPE_CASE = `
  CASE
    WHEN activiteit_type ILIKE '%behandeling%' OR activiteit_type = 'zpm1010' THEN 'behandeling'
    WHEN activiteit_type ILIKE '%workshop%'    OR activiteit_type = 'zpm1040' THEN 'workshop'
    WHEN activiteit_type ILIKE '%diagnostiek%' OR activiteit_type = 'zpm1001' THEN 'diagnostiek'
    WHEN activiteit_type ILIKE '%evaluatie%'   OR activiteit_type = 'zpm1070' THEN 'evaluatie'
    WHEN activiteit_type ILIKE '%intake%'      OR activiteit_type LIKE '300%' THEN 'intake'
    WHEN activiteit_type ILIKE '%gereserveerd%'                               THEN 'reserved'
    ELSE 'other'
  END
`;

export function computeEndTime(startTime: string, durationMinutes: number): string {
  const [h, m] = startTime.split(':').map(Number);
  const total = (h ?? 0) * 60 + (m ?? 0) + durationMinutes;
  const endH = Math.floor(total / 60) % 24;
  const endM = total % 60;
  return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
}

export function classifyLocation(locatie: string): { type: LocationType; city: string | null } {
  const lower = locatie.toLowerCase();
  if (lower.startsWith('online behandelkamer') || lower.startsWith('online ')) return { type: 'online', city: null };
  if (lower.includes('thuis') || lower.includes('bij client')) return { type: 'home', city: null };
  if (lower.includes('telefonisch')) return { type: 'phone', city: null };

  const cityPatterns: { pattern: RegExp; city: string }[] = [
    { pattern: /amsterdam/i, city: 'Amsterdam' },
    { pattern: /utrecht daltonlaan/i, city: 'Utrecht' },
    { pattern: /utrecht/i, city: 'Utrecht' },
    { pattern: /rotterdam/i, city: 'Rotterdam' },
    { pattern: /nijmegen/i, city: 'Nijmegen' },
    { pattern: /heerlen/i, city: 'Heerlen' },
    { pattern: /venray/i, city: 'Venray' },
  ];
  for (const { pattern, city } of cityPatterns) {
    if (pattern.test(locatie)) return { type: 'physical', city };
  }
  return { type: 'unknown', city: null };
}

export function corsHeaders() {
  return { 'Access-Control-Allow-Origin': '*' };
}
