import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

const ORG_ID = 'ec45b04e-9191-4e6c-83dc-f20d321be5ef';

export async function GET(request: NextRequest) {
  const p = request.nextUrl.searchParams;
  const start = p.get('start') ?? new Date().toISOString().slice(0, 10);
  const end = p.get('end') ?? new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10);

  try {
    const rows = await query(
      `SELECT
        first_name, last_name,
        time_off_type, base_time_off_type,
        start_date::text, end_date::text,
        leave_unit, budget_total, notes, status
      FROM hooray_time_off
      WHERE organization_id = $1
        AND status = 3
        AND start_date >= $2 AND start_date <= $3
      ORDER BY start_date DESC`,
      [ORG_ID, start, end],
    );

    const entries = rows.map((r: Record<string, unknown>) => ({
      firstName: r.first_name as string,
      lastName: r.last_name as string,
      type: r.time_off_type,
      baseType: r.base_time_off_type,
      startDate: (r.start_date as string)?.slice(0, 10),
      endDate: (r.end_date as string)?.slice(0, 10),
      leaveUnit: r.leave_unit,
      budgetTotal: r.budget_total ? Number(r.budget_total) : null,
      notes: r.notes,
    }));

    return NextResponse.json({ entries, count: entries.length }, { headers: { 'Access-Control-Allow-Origin': '*' } });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Database error', entries: [], count: 0 }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
  }
}
