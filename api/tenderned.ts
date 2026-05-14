import type { VercelRequest, VercelResponse } from '@vercel/node';

const TNS_BASE = 'https://www.tenderned.nl/papi/tenderned-rs-tns/publicaties';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const gemeente = typeof req.query.gemeente === 'string' ? req.query.gemeente : '';

  const user = process.env.TNUSER;
  const pass = process.env.TNPASS;

  if (!user || !pass) {
    return res.status(500).json({ error: 'TenderNed credentials niet geconfigureerd.' });
  }

  const basic = Buffer.from(`${user}:${pass}`).toString('base64');

  try {
    const upstream = await fetch(TNS_BASE, {
      headers: {
        Authorization: `Basic ${basic}`,
        Accept: 'application/json, */*',
      },
    });

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: `TenderNed API: HTTP ${upstream.status}` });
    }

    const json = await upstream.json() as { content?: Record<string, unknown>[] };
    const all = json.content ?? [];

    const filtered = gemeente
      ? all.filter(p => {
          const naam = String(p.opdrachtgeverNaam ?? '');
          return naam.toLowerCase().includes(gemeente.toLowerCase());
        })
      : all;

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json({ content: filtered });
  } catch (err) {
    return res.status(502).json({ error: String(err) });
  }
}
