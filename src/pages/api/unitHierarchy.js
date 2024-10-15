import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

function buildHierarchy(units) {
  const unitMap = new Map();
  const rootUnits = [];

  units.forEach(unit => {
    unitMap.set(unit.id, { ...unit, children: [] });
  });

  units.forEach(unit => {
    if (unit.parent_id === null) {
      rootUnits.push(unitMap.get(unit.id));
    } else {
      const parent = unitMap.get(unit.parent_id);
      if (parent) {
        parent.children.push(unitMap.get(unit.id));
      }
    }
  });

  return rootUnits;
}

export default async function handler(req, res) {
  try {
    const client = await pool.connect();
    
    // Fetch units with their latest readiness scores
    const result = await client.query(`
      SELECT u.*, 
             r.personnel_readiness, r.equipment_readiness, 
             r.training_readiness, r.supplies_readiness, r.overall_readiness
      FROM units u
      LEFT JOIN (
        SELECT DISTINCT ON (unit_id) *
        FROM readiness_scores
        ORDER BY unit_id, date DESC
      ) r ON u.id = r.unit_id
      ORDER BY u.level, u.name
    `);

    const units = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      level: row.level,
      parent_id: row.parent_id,
      specialty: row.specialty,
      location_lat: row.location_lat,
      location_lon: row.location_lon,
      personnel: row.personnel_readiness,
      equipment: row.equipment_readiness,
      training: row.training_readiness,
      deployment: row.supplies_readiness, // Using supplies_readiness as deployment
      overall_readiness: row.overall_readiness
    }));

    const unitHierarchy = buildHierarchy(units);
    
    client.release();
    res.status(200).json(unitHierarchy);
  } catch (err) {
    console.error('Error fetching unit hierarchy:', err);
    res.status(500).json({ error: 'Error fetching unit hierarchy' });
  }
}
