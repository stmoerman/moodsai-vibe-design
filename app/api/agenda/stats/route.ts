import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { query } from '@/lib/db';
import {
  BASE_WHERE, ACTIVITY_FILTER, ACTIVITY_TYPE_CASE,
  corsHeaders,
} from '@/lib/agenda-utils';
import { mockAgendaStats } from '@/data/agenda-mock-data';

const paramsSchema = z.object({
  start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams;
  const parsed = paramsSchema.safeParse(Object.fromEntries(url.entries()));

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid parameters', details: parsed.error.flatten() },
      { status: 400, headers: corsHeaders() },
    );
  }

  const { start, end } = parsed.data;

  try {
    const [byTypeRows, byMonthRows] = await Promise.all([
      query<{ activity_type: string; count: string; avg_duration: string; with_client: string }>(
        `SELECT
          ${ACTIVITY_TYPE_CASE} AS activity_type,
          COUNT(*)::int AS count,
          ROUND(AVG(COALESCE(direct_duur, 0)))::int AS avg_duration,
          COUNT(r56_client_naam)::int AS with_client
        FROM silver.hci_time_entry
        WHERE ${BASE_WHERE} ${ACTIVITY_FILTER}
          AND datum >= $1 AND datum <= $2
        GROUP BY 1
        ORDER BY count DESC`,
        [start, end],
      ),
      query<{ year: string; month: string; total: string; therapists: string }>(
        `SELECT
          EXTRACT(YEAR FROM datum)::int AS year,
          EXTRACT(MONTH FROM datum)::int AS month,
          COUNT(*)::int AS total,
          COUNT(DISTINCT rb_naam)::int AS therapists
        FROM silver.hci_time_entry
        WHERE ${BASE_WHERE} ${ACTIVITY_FILTER}
          AND datum >= $1 AND datum <= $2
        GROUP BY 1, 2
        ORDER BY 1, 2`,
        [start, end],
      ),
    ]);

    const byType: Record<string, { count: number; avgDuration: number; withClient: number }> = {};
    let totalEntries = 0;
    for (const row of byTypeRows) {
      byType[row.activity_type] = {
        count: Number(row.count),
        avgDuration: Number(row.avg_duration),
        withClient: Number(row.with_client),
      };
      totalEntries += Number(row.count);
    }

    const byMonth = byMonthRows.map((row) => ({
      year: Number(row.year),
      month: Number(row.month),
      total: Number(row.total),
      therapists: Number(row.therapists),
    }));

    return NextResponse.json(
      { period: { start, end }, totalEntries, byType, byMonth },
      { headers: corsHeaders() },
    );
  } catch (err) {
    console.error('Database error, falling back to mock stats:', err);
    return NextResponse.json(
      { ...mockAgendaStats, mock: true },
      { headers: corsHeaders() },
    );
  }
}
