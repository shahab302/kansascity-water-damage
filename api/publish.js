export default async function handler(req) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }
  const hook = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!hook) return new Response('No deploy hook configured', { status: 500 });
  const res = await fetch(hook, { method: 'POST' });
  return new Response(`Deploy triggered: ${res.status}`, { status: 200 });
}
