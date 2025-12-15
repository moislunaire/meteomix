import type { VercelRequest, VercelResponse } from '@vercel/node';

// Helper: build URL with search params
function buildUrl(base: string, params: Record<string, string | number | undefined>) {
  const url = new URL(base);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
  });
  return url.toString();
}

// Helper: fetch with timeout
async function fetchWithTimeout(
  input: string,
  init: RequestInit = {},
  timeoutMs = 15000
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const resp = await fetch(input, { ...init, signal: controller.signal });
    return resp;
  } finally {
    clearTimeout(timer);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.WEATHERAPI_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server misconfiguration: WEATHERAPI_KEY is not set' });
  }

  try {
    // Whitelist query params that we allow to forward
    // Common for forecast: q, days, aqi, alerts, lang
    const { q, days, aqi, alerts, lang } = req.query as Record<string, string>;

    if (!q) {
      return res.status(400).json({ error: 'Missing required parameter: q' });
    }

    const endpoint = 'https://api.weatherapi.com/v1/forecast.json';
    const url = buildUrl(endpoint, {
      key: apiKey,
      q,
      days,
      aqi,
      alerts,
      lang,
    });

    const upstream = await fetchWithTimeout(url, { headers: { Accept: 'application/json' } });

    const contentType = upstream.headers.get('content-type') || '';
    const status = upstream.status;

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => '');
      console.error('WeatherAPI upstream error', { status, text });
      return res.status(status).send(text || 'Upstream error');
    }

    // Pass through JSON
    if (contentType.includes('application/json')) {
      const data = await upstream.json();
      // Optional: basic caching headers to reduce provider load
      res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=300');
      return res.status(200).json(data);
    }

    // Fallback: proxy as text
    const text = await upstream.text();
    res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=120');
    return res.status(200).send(text);
  } catch (err: unknown) {
    if (err instanceof Error && err?.name === 'AbortError') {
      console.error('WeatherAPI request timed out');
      return res.status(504).json({ error: 'Gateway Timeout' });
    }
    console.error('WeatherAPI proxy error', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
