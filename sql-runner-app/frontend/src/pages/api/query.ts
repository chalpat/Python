import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { query } = req.body;

        try {
            // Backend endpoint is `/execute` in `backend/app.py`.
            // Use the backend URL here; the Next.js API route runs server-side,
            // so this call is not subject to browser CORS.
            const response = await fetch('http://localhost:5000/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            });

            const data = await response.json();

            if (response.ok) {
                res.status(200).json(data);
            } else {
                res.status(response.status).json({ error: data.error });
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}