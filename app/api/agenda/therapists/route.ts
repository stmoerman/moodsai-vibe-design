import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { query } from '@/lib/db';
import {
  BASE_WHERE, ACTIVITY_FILTER, ACTIVITY_TYPE_CASE,
  corsHeaders,
} from '@/lib/agenda-utils';
import { mockAgendaEntries } from '@/data/agenda-mock-data';

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
    const rows = await query<{ name: string; entry_count: string; activity_types: string[] }>(
      `SELECT
        rb_naam AS name,
        COUNT(*)::int AS entry_count,
        ARRAY_AGG(DISTINCT ${ACTIVITY_TYPE_CASE}) AS activity_types
      FROM silver.hci_time_entry
      WHERE ${BASE_WHERE} ${ACTIVITY_FILTER}
        AND datum >= $1 AND datum <= $2
      GROUP BY rb_naam
      ORDER BY entry_count DESC`,
      [start, end],
    );

    const therapists = rows.map((row) => ({
      name: row.name,
      entryCount: Number(row.entry_count),
      activityTypes: row.activity_types,
    }));

    return NextResponse.json(
      { therapists, count: therapists.length },
      { headers: corsHeaders() },
    );
  } catch (err) {
    console.error('Database error, falling back to mock therapists:', err);

    // Derive from mock data
    const filtered = mockAgendaEntries.filter((e) => e.date >= start && e.date <= end);
    const map = new Map<string, { count: number; types: Set<string> }>();
    for (const e of filtered) {
      const existing = map.get(e.therapistName) ?? { count: 0, types: new Set() };
      existing.count++;
      existing.types.add(e.activityType);
      map.set(e.therapistName, existing);
    }

    const therapists = Array.from(map.entries())
      .map(([name, { count, types }]) => ({
        name,
        entryCount: count,
        activityTypes: Array.from(types),
      }))
      .sort((a, b) => b.entryCount - a.entryCount);

    return NextResponse.json(
      { therapists, count: therapists.length, mock: true },
      { headers: corsHeaders() },
    );
  }
}
