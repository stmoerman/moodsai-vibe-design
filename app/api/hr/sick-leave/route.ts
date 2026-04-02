import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

const ORG_ID = 'ec45b04e-9191-4e6c-83dc-f20d321be5ef';

export async function GET() {
  try {
    const rows = await query(
      `SELECT
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
      ORDER BY p.start_date DESC`,
      [ORG_ID],
    );

    const entries = rows.map((r: Record<string, unknown>) => ({
      dossierId: r.dossier_id,
      firstName: r.first_name as string,
      lastName: r.last_name as string,
      percentage: Number(r.percentage),
      phaseStart: r.phase_start,
      expectedReturn: r.expected_return,
      phaseEnd: r.phase_end,
      status: r.status,
      notes: r.notes,
    }));

    const currentlySick = entries.filter((e) => !e.phaseEnd);

    return NextResponse.json({ entries, currentlySick, count: entries.length }, { headers: { 'Access-Control-Allow-Origin': '*' } });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Database error', entries: [], currentlySick: [], count: 0 }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
  }
}
