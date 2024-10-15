import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  try {
    const client = await pool.connect();
    const result = await client.query(`
      SELECT a.id, a.unit_id, u.name as unit_name, a.date, a.message, a.severity,
             r.personnel_readiness, r.equipment_readiness, r.training_readiness, r.supplies_readiness
      FROM alerts a
      JOIN units u ON a.unit_id = u.id
      LEFT JOIN readiness_scores r ON a.unit_id = r.unit_id AND r.date = (
        SELECT MAX(date) FROM readiness_scores WHERE unit_id = a.unit_id
      )
      ORDER BY a.date DESC
      LIMIT 10
    `);
    
    const alerts = result.rows.map(row => {
      const readinessScores = {
        personnel: row.personnel_readiness,
        equipment: row.equipment_readiness,
        training: row.training_readiness,
        supplies: row.supplies_readiness
      };
      
      const lowestReadiness = Object.entries(readinessScores).reduce((lowest, [key, value]) => 
        value < lowest.value ? { metric: key, value } : lowest
      , { metric: '', value: 100 });

      return {
        id: row.id,
        unit_id: row.unit_id,
        unit: row.unit_name,
        date: row.date,
        message: row.message,
        severity: row.severity,
        metric: lowestReadiness.metric,
        value: lowestReadiness.value
      };
    });

    client.release();
    res.status(200).json(alerts);
  } catch (err) {
    console.error('Error fetching alerts:', err);
    res.status(500).json({ error: 'Error fetching alerts' });
  }
}
