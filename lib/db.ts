import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.AGENDA_DATABASE_URL,
  ssl: false,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err);
});

export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[],
): Promise<T[]> {
  const client = await pool.connect();
  try {
    await client.query("SET search_path = silver, public");
    const result = await client.query(text, params);
    return result.rows as T[];
  } finally {
    client.release();
  }
}

export { pool };
