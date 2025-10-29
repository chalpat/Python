import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { name },
    method,
  } = req;

  if (method === 'GET') {
    if (!name || Array.isArray(name)) {
      res.status(400).json({ error: 'Table name is required' });
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/table/${encodeURIComponent(name)}`);
      const data = await response.json();
      if (response.ok) {
        res.status(200).json(data);
      } else {
        res.status(response.status).json({ error: data.error });
      }
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch table info' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
