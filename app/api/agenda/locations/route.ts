import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import {
  BASE_WHERE, ACTIVITY_FILTER,
  classifyLocation, corsHeaders,
  type AgendaLocation, type LocationType,
} from '@/lib/agenda-utils';
import { mockLocations } from '@/data/agenda-mock-data';

export async function GET() {
  try {
    const rows = await query<{ location: string; count: string }>(
      `SELECT
        locatie AS location,
        COUNT(*)::int AS count
      FROM silver.hci_time_entry
      WHERE ${BASE_WHERE} ${ACTIVITY_FILTER}
        AND datum >= (CURRENT_DATE - INTERVAL '6 months')
      GROUP BY locatie
      ORDER BY count DESC`,
    );

    const locations: AgendaLocation[] = rows.map((row) => {
      const { type, city } = classifyLocation(row.location);
      return {
        name: row.location,
        type,
        city,
        entryCount: Number(row.count),
      };
    });

    const summary = {
      physical: locations.filter((l) => l.type === 'physical').length,
      online: locations.filter((l) => l.type === 'online').length,
      home: locations.filter((l) => l.type === 'home').length,
      cities: [...new Set(locations.filter((l) => l.city).map((l) => l.city))].sort() as string[],
      totalLocations: locations.length,
    };

    return NextResponse.json(
      { locations, summary },
      { headers: corsHeaders() },
    );
  } catch (err) {
    console.error('Database error, falling back to mock locations:', err);

    const summary = {
      physical: mockLocations.filter((l) => l.type === 'physical').length,
      online: mockLocations.filter((l) => l.type === 'online').length,
      home: mockLocations.filter((l) => l.type === 'home').length,
      cities: [...new Set(mockLocations.filter((l) => l.city).map((l) => l.city))].sort() as string[],
      totalLocations: mockLocations.length,
    };

    return NextResponse.json(
      { locations: mockLocations, summary, mock: true },
      { headers: corsHeaders() },
    );
  }
}
