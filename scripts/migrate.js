const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

async function migrate() {
  const password = process.env.SUPABASE_DB_PASSWORD
  const projectRef = 'uvaxuteovtfppvenmrvg'

  const client = new Client({
    host: `aws-0-eu-west-1.pooler.supabase.com`,
    port: 6543,
    database: 'postgres',
    user: `postgres.${projectRef}`,
    password,
    ssl: { rejectUnauthorized: false },
  })

  await client.connect()

  const migrationsDir = path.join(__dirname, '../supabase/migrations')
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort()

  await client.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      name TEXT PRIMARY KEY,
      ran_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)

  for (const file of files) {
    const { rows } = await client.query('SELECT 1 FROM _migrations WHERE name = $1', [file])
    if (rows.length > 0) {
      console.log(`skipping ${file} (already ran)`)
      continue
    }
    console.log(`running ${file}`)
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8')
    await client.query(sql)
    await client.query('INSERT INTO _migrations (name) VALUES ($1)', [file])
    console.log(`done ${file}`)
  }

  await client.end()
}

migrate().catch(err => { console.error('Migration failed:', err.message, err.code, err.detail); process.exit(1) })
