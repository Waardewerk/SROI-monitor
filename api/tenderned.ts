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

    const text = await upstream.text();

    // Stuur ruwe response terug zodat we de structuur zien
    return res.status(200).json({
      httpStatus: upstream.status,
      rawPreview: text.slice(0, 2000),
      gemeente,
    });
  } catch (err) {
    return res.status(502).json({ error: String(err) });
  }
}
