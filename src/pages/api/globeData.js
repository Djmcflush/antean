import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  try {
    const client = await pool.connect();
    const result = await client.query(`
      SELECT u.id, u.name, u.level, u.specialty, u.location_lat, u.location_lon, 
             r.overall_readiness
      FROM units u
      LEFT JOIN readiness_scores r ON u.id = r.unit_id
      WHERE r.date = (SELECT MAX(date) FROM readiness_scores WHERE unit_id = u.id)
    `);
    const globeData = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      level: row.level,
      specialty: row.specialty,
      lat: row.location_lat,
      lng: row.location_lon,
      readiness: row.overall_readiness
    }));
    client.release();
    res.status(200).json(globeData);
  } catch (err) {
    console.error('Error fetching globe data:', err);
    res.status(500).json({ error: 'Error fetching globe data' });
  }
}
