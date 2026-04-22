const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY || 'vSECgRvhfpCIPaDHI0R6PUtQSqak7jdbLDEzRIRo20eKXENo33naUJywsvzMtjaN';
const BEEHIIV_PUB_ID = process.env.BEEHIIV_PUB_ID || 'pub_283fcbfd-3c83-4656-8fc0-84b3ff56b764';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, first_name, utm_source, utm_medium, utm_campaign } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  try {
    const response = await fetch(`https://api.beehiiv.com/v2/publications/${BEEHIIV_PUB_ID}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BEEHIIV_API_KEY}`,
      },
      body: JSON.stringify({
        email,
        first_name: first_name || '',
        reactivate_existing: true,
        send_welcome_email: true,
        utm_source: utm_source || 'manychat',
        utm_medium: utm_medium || 'facebook',
        utm_campaign: utm_campaign || 'comment_funnel',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json({ success: true, subscriber: data });
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
}
