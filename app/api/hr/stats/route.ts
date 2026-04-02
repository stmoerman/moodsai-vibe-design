import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

const ORG_ID = 'ec45b04e-9191-4e6c-83dc-f20d321be5ef';

export async function GET() {
  try {
    const [activeRes, inactiveRes, sickRes, leaveRes, contractRes] = await Promise.all([
      query('SELECT COUNT(*)::int AS c FROM hr_employee WHERE organization_id = $1 AND is_active = true', [ORG_ID]),
      query('SELECT COUNT(*)::int AS c FROM hr_employee WHERE organization_id = $1 AND is_active = false', [ORG_ID]),
      query(`SELECT COUNT(*)::int AS c FROM hooray_sick_leave_phase p
        JOIN hooray_sick_leave_dossier d ON p.dossier_id = d.id
        WHERE d.organization_id = $1 AND p.calculated_end_date IS NULL`, [ORG_ID]),
      query(`SELECT COUNT(*)::int AS c FROM hooray_time_off
        WHERE organization_id = $1 AND status = 3
        AND start_date <= NOW() AND end_date >= NOW()`, [ORG_ID]),
      query(`SELECT COUNT(*)::int AS c FROM hooray_contract
        WHERE organization_id = $1
        AND end_date IS NOT NULL
        AND end_date <= NOW() + INTERVAL '90 days'
        AND end_date >= NOW()`, [ORG_ID]),
    ]);

    return NextResponse.json({
      activeEmployees: (activeRes[0] as Record<string, unknown>)?.c ?? 0,
      inactiveEmployees: (inactiveRes[0] as Record<string, unknown>)?.c ?? 0,
      currentlySick: (sickRes[0] as Record<string, unknown>)?.c ?? 0,
      onLeaveToday: (leaveRes[0] as Record<string, unknown>)?.c ?? 0,
      contractsExpiring90d: (contractRes[0] as Record<string, unknown>)?.c ?? 0,
    }, { headers: { 'Access-Control-Allow-Origin': '*' } });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Database error' }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
  }
}
