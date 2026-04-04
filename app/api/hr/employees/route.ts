import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

const ORG_ID = 'ec45b04e-9191-4e6c-83dc-f20d321be5ef';

export async function GET(request: NextRequest) {
  const p = request.nextUrl.searchParams;
  const active = p.get('active') !== 'false';

  try {
    // Main employee query
    const rows = await query(
      `SELECT
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
      WHERE e.organization_id = $1 AND e.is_active = $2
      ORDER BY e.last_name, e.first_name`,
      [ORG_ID, active],
    );

    // Enrich from agenda data: get most common location and recent activity per therapist
    const agendaRows = await query<{ rb_naam: string; top_locatie: string; entry_count: string; activity_types: string[] }>(
      `SELECT
        rb_naam,
        mode() WITHIN GROUP (ORDER BY locatie) AS top_locatie,
        COUNT(*)::int AS entry_count,
        ARRAY_AGG(DISTINCT
          CASE
            WHEN activiteit_type ILIKE '%behandeling%' THEN 'behandeling'
            WHEN activiteit_type ILIKE '%workshop%' THEN 'workshop'
            WHEN activiteit_type ILIKE '%diagnostiek%' THEN 'diagnostiek'
            WHEN activiteit_type ILIKE '%evaluatie%' THEN 'evaluatie'
            WHEN activiteit_type ILIKE '%intake%' OR activiteit_type LIKE '300%' THEN 'intake'
            ELSE NULL
          END
        ) FILTER (WHERE activiteit_type IS NOT NULL) AS activity_types
      FROM silver.hci_time_entry
      WHERE organization_id = $1 AND report_id = 56
        AND datum >= (CURRENT_DATE - INTERVAL '3 months')
        AND tijd IS NOT NULL AND tijd != ''
      GROUP BY rb_naam`,
      [ORG_ID],
    ).catch(() => [] as { rb_naam: string; top_locatie: string; entry_count: string; activity_types: string[] }[]);

    // Build lookup by rb_naam
    const agendaByName = new Map<string, { topLocatie: string; entryCount: number; activityTypes: string[] }>();
    for (const row of agendaRows) {
      agendaByName.set(row.rb_naam, {
        topLocatie: row.top_locatie,
        entryCount: Number(row.entry_count),
        activityTypes: (row.activity_types ?? []).filter(Boolean),
      });
    }

    const employees = rows.map((r: Record<string, unknown>) => {
      const agenda = r.hci_rb_naam ? agendaByName.get(r.hci_rb_naam as string) : undefined;
      return {
        id: r.id,
        firstName: r.first_name as string,
        lastName: r.last_name as string,
        email: r.email,
        function: r.function,
        isActive: r.is_active,
        contractType: r.contract_type,
        contractStart: r.contract_start_date,
        contractEnd: r.contract_end_date,
        locatie: r.locatie ?? agenda?.topLocatie ?? null,
        team: r.team,
        functieCode: r.functie_code,
        doelstellingProcent: r.doelstelling_procent ? Number(r.doelstelling_procent) : null,
        recentSessions: agenda?.entryCount ?? 0,
        activityTypes: agenda?.activityTypes ?? [],
      };
    });

    return NextResponse.json({ employees, count: employees.length }, { headers: { 'Access-Control-Allow-Origin': '*' } });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Database error', employees: [], count: 0 }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
  }
}
