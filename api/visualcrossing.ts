import type { VercelRequest, VercelResponse } from '@vercel/node';

function buildUrl(base: string, params: Record<string, string | number | undefined>) {
  const url = new URL(base);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
  });
  return url.toString();
}

async function fetchWithTimeout(
  input: string,
  init: RequestInit = {},
  timeoutMs = 20000
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

  const apiKey = process.env.VISUALCROSSING_API_KEY;
  if (!apiKey) {
    return res
      .status(500)
      .json({ error: 'Server misconfiguration: VISUALCROSSING_API_KEY is not set' });
  }

  try {
    // Expected parameters: location (required), unitGroup, include, lang, elements, etc.
    // We support a safe whitelist.
    const { location, unitGroup, include, lang, elements, contentType } = req.query as Record<
      string,
      string
    >;

    if (!location) {
      return res.status(400).json({ error: 'Missing required parameter: location' });
    }

    const base = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}`;

    const url = buildUrl(base, {
      key: apiKey,
      unitGroup,
      include,
      lang,
      elements,
      contentType: contentType ?? 'json',
    });

    const upstream = await fetchWithTimeout(url, { headers: { Accept: 'application/json' } });
    const status = upstream.status;

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => '');
      console.error('VisualCrossing upstream error', { status, text });
      return res.status(status).send(text || 'Upstream error');
    }

    const ct = upstream.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      const data = await upstream.json();
      res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=300');
      return res.status(200).json(data);
    }

    const text = await upstream.text();
    res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=120');
    return res.status(200).send(text);
  } catch (err: unknown) {
    if (err instanceof Error && err?.name === 'AbortError') {
      console.error('VisualCrossing request timed out');
      return res.status(504).json({ error: 'Gateway Timeout' });
    }
    console.error('VisualCrossing proxy error', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
