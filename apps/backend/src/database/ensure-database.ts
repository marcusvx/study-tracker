import 'dotenv/config';
import { Client } from 'pg';

function sanitizeDbIdentifier(name: string): string {
  const isValid = /^[a-zA-Z_]\w*$/.test(name);

  if (!isValid) {
    throw new Error(
      `Invalid database name "${name}" in DATABASE_URL. Use letters, numbers, and underscore.`,
    );
  }

  return `"${name}"`;
}

async function ensureDatabase(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set');
  }

  const dbName = new URL(databaseUrl).pathname.replace(/^\//, '');
  const maintenanceUrl = new URL(databaseUrl);
  maintenanceUrl.pathname = '/postgres';

  const client = new Client({
    connectionString: maintenanceUrl.toString(),
    ssl:
      process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : undefined,
  });

  await client.connect();

  try {
    const result = await client.query<{ exists: boolean }>(
      'SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = $1) AS "exists"',
      [dbName],
    );

    if (result.rows[0]?.exists) {
      console.log(`Database ${dbName} already exists`);
      return;
    }

    const quotedDbName = sanitizeDbIdentifier(dbName);
    await client.query(`CREATE DATABASE ${quotedDbName}`);
    console.log(`Database ${dbName} created`);
  } finally {
    await client.end();
  }
}

void ensureDatabase();
