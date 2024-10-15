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
    // Read and execute schema.sql
    const schemaSQL = fs.readFileSync(path.join(__dirname, 'src', 'db', 'schema.sql'), 'utf8');
    await client.query(schemaSQL);
    console.log('Schema created successfully');

    // Read and execute readiness_predictions.sql
    const readinessPredictionsSQL = fs.readFileSync(path.join(__dirname, 'src', 'db', 'readiness_predictions.sql'), 'utf8');
    await client.query(readinessPredictionsSQL);
    console.log('Readiness predictions table created successfully');

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
