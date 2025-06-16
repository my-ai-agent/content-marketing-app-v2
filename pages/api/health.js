// pages/api/health.js
// Health check for Pages Router

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const healthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.1.0 - Next.js Pages Router',
    message: 'API route is working!',
    router: 'Pages Router',
    nextVersion: '14.2.5',
    test: 'Success - Pages Router API endpoint functional'
  };

  res.status(200).json(healthStatus);
}
