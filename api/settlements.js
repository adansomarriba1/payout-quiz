export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const response = await fetch('https://payout-backend.vercel.app/api/v2/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const data = await response.json();
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch settlements' });
  }
}
