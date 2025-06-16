// app/api/health/route.js
// Simple health check that definitely works

export async function GET(request) {
  return new Response(JSON.stringify({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    message: 'API route is working!',
    version: '2.1.0 - Next.js App Router',
    test: 'Success - your enhanced backend structure is ready'
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
