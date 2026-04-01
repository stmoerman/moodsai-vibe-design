import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { query } from '@/lib/db';
import {
  BASE_WHERE, ACTIVITY_FILTER, ACTIVITY_TYPE_CASE,
  computeEndTime, corsHeaders,
  type AgendaEntry,
} from '@/lib/agenda-utils';
import { mockAgendaEntries } from '@/data/agenda-mock-data';

const paramsSchema = z.object({
  start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  types: z.string().optional(),
  location: z.string().optional(),
  therapist: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(2000).default(500),
  offset: z.coerce.number().int().min(0).default(0),
});

interface DbRow {
  id: string;
  date: string;
  start_time: string;
  duration: number;
  activity_type: string;
  therapist: string;
  client_name: string | null;
  status: string | null;
  location: string;
  description: string;
}

function mapRow(row: DbRow): AgendaEntry {
  return {
    id: row.id,
    date: row.date,
    startTime: row.start_time,
    endTime: computeEndTime(row.start_time, row.duration),
    duration: row.duration,
    activityType: row.activity_type as AgendaEntry['activityType'],
    therapistName: row.therapist,
    clientName: row.client_name || null,
    status: row.status || null,
    location: row.location ?? '',
    description: row.description ?? '',
  };
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams;
  const parsed = paramsSchema.safeParse(Object.fromEntries(url.entries()));

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid parameters', details: parsed.error.flatten() },
      { status: 400, headers: corsHeaders() },
    );
  }

  const { start, end, types, location, therapist, limit, offset } = parsed.data;

  try {
    const conditions: string[] = [`${BASE_WHERE}`, `datum >= $1`, `datum <= $2`];
    const params: unknown[] = [start, end];
    let paramIndex = 3;

    // Activity filter
    conditions.push(ACTIVITY_FILTER.trim().replace(/^AND\s+/, ''));

    // Optional type filter
    if (types) {
      const typeList = types.split(',').map((t) => t.trim());
      conditions.push(`${ACTIVITY_TYPE_CASE} = ANY($${paramIndex})`);
      params.push(typeList);
      paramIndex++;
    }

    // Optional location filter
    if (location) {
      conditions.push(`locatie ILIKE $${paramIndex}`);
      params.push(`%${location}%`);
      paramIndex++;
    }

    // Optional therapist filter
    if (therapist) {
      conditions.push(`rb_naam ILIKE $${paramIndex}`);
      params.push(`%${therapist}%`);
      paramIndex++;
    }

    const sql = `
      SELECT
        id,
        datum::text AS date,
        tijd AS start_time,
        COALESCE(direct_duur, 0)::int AS duration,
        ${ACTIVITY_TYPE_CASE} AS activity_type,
        rb_naam AS therapist,
        r56_client_naam AS client_name,
        r56_status_omschr AS status,
        locatie AS location,
        COALESCE(omschrijving, '') AS description
      FROM silver.hci_time_entry
      WHERE ${conditions.join(' AND ')}
      ORDER BY datum, tijd
      LIMIT ${limit} OFFSET ${offset}
    `;

    const rows = await query<DbRow>(sql, params);
    const entries = rows.map(mapRow);

    return NextResponse.json(
      { entries, count: entries.length, params: { start, end } },
      { headers: corsHeaders() },
    );
  } catch (err) {
    console.error('Database error, falling back to mock data:', err);

    // Fallback to mock data
    let entries = mockAgendaEntries.filter(
      (e) => e.date >= start && e.date <= end,
    );
    if (types) {
      const typeList = types.split(',');
      entries = entries.filter((e) => typeList.includes(e.activityType));
    }
    if (location) {
      const loc = location.toLowerCase();
      entries = entries.filter((e) => e.location.toLowerCase().includes(loc));
    }
    if (therapist) {
      const th = therapist.toLowerCase();
      entries = entries.filter((e) => e.therapistName.toLowerCase().includes(th));
    }
    entries = entries.slice(offset, offset + limit);

    return NextResponse.json(
      { entries, count: entries.length, params: { start, end }, mock: true },
      { headers: corsHeaders() },
    );
  }
}
