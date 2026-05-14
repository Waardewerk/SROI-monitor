import type { VercelRequest, VercelResponse } from '@vercel/node';

// TenderNed XML webservice endpoint
const TNS_BASE = 'https://www.tenderned.nl/papi/tenderned-rs-tns/publicaties';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const gemeente = typeof req.query.gemeente === 'string' ? req.query.gemeente : '';

  const user = process.env.TNUSER;
  const pass = process.env.TNPASS;

  if (!user || !pass) {
    return res.status(500).json({ error: 'TenderNed credentials niet geconfigureerd.' });
  }

  const basic = Buffer.from(`${user}:${pass}`).toString('base64');

  // Probeer eerst zonder size/page params
  const urls = [
    `${TNS_BASE}`,
    `${TNS_BASE}?rows=100&start=0`,
    `${TNS_BASE}?size=100&page=0`,
    `${TNS_BASE}?max=100&offset=0`,
  ];

  let lastStatus = 0;
  let lastBody = '';

  for (const url of urls) {
    try {
      const upstream = await fetch(url, {
        headers: {
          Authorization: `Basic ${basic}`,
          Accept: 'application/json, application/xml, */*',
        },
      });

      lastStatus = upstream.status;
      const text = await upstream.text();
      lastBody = text.slice(0, 500);

      if (upstream.ok) {
        // Probeer JSON te parsen
        let parsed: Record<string, unknown>;
        try {
          parsed = JSON.parse(text);
        } catch {
          // Als het XML is, stuur raw terug met debug info
          return res.status(200).json({
            debug: { url, format: 'xml', preview: text.slice(0, 300) },
            content: [],
          });
        }

        const all = (parsed.content ?? parsed.contents ?? parsed.publicaties ?? []) as Record<string, unknown>[];

        const filtered = gemeente
          ? all.filter(p => {
              const dienst = String(p.aanbestedendeDienst ?? '');
              return dienst.toLowerCase().includes(gemeente.toLowerCase());
            })
          : all;

        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
        return res.status(200).json({ content: filtered, debug: { url } });
      }
    } catch (err) {
      lastBody = String(err);
    }
  }

  return res.status(502).json({
    error: `TenderNed API: HTTP ${lastStatus}`,
    debug: { lastBody },
  });
}
