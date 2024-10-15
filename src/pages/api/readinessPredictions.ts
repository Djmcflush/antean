import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const result = await query(
        'SELECT * FROM readiness_predictions ORDER BY start_date'
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching readiness predictions' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
