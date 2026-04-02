import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

const ORG_ID = 'ec45b04e-9191-4e6c-83dc-f20d321be5ef';

export async function GET(request: NextRequest) {
  const p = request.nextUrl.searchParams;
  const active = p.get('active') !== 'false';

  try {
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

    const employees = rows.map((r: Record<string, unknown>) => ({
      id: r.id,
      firstName: r.first_name as string,
      lastName: r.last_name as string,
      email: r.email,
      function: r.function,
      isActive: r.is_active,
      contractType: r.contract_type,
      contractStart: r.contract_start_date,
      contractEnd: r.contract_end_date,
      locatie: r.locatie,
      team: r.team,
      functieCode: r.functie_code,
      doelstellingProcent: r.doelstelling_procent ? Number(r.doelstelling_procent) : null,
    }));

    return NextResponse.json({ employees, count: employees.length }, { headers: { 'Access-Control-Allow-Origin': '*' } });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Database error', employees: [], count: 0 }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
  }
}
