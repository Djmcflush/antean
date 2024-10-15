require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function setupDatabase() {
  const client = await pool.connect();
  try {
    // Read and execute SQL files to create tables
    const sqlFiles = [
      'personnel_readiness.sql',
      'aggregate_readiness.sql',
      'alerts.sql',
      'family_readiness.sql',
      'medical_readiness.sql',
      'readiness.sql',
      'units.sql',
      'readiness_predictions.sql'
    ];

    for (const file of sqlFiles) {
      const sql = fs.readFileSync(path.join(__dirname, 'src', 'db', file), 'utf8');
      await client.query(sql);
      console.log(`${file} executed successfully`);
    }

    // Read and execute sample_data.sql
    const sampleDataSQL = fs.readFileSync(path.join(__dirname, 'src', 'db', 'sample_data.sql'), 'utf8');
    await client.query(sampleDataSQL);
    console.log('Sample data inserted successfully');

    console.log('Database setup completed');
  } catch (err) {
    console.error('Error setting up database:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

setupDatabase();
