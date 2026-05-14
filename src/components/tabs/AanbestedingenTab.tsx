import { useEffect, useState } from 'react';
import { ExternalLink, FileText, Calendar, AlertCircle, Loader2, Search } from 'lucide-react';
import type { GemeenteInfo } from '../../types';

interface TypePublicatie {
  code: string;
  omschrijving: string;
}

interface Publicatie {
  publicatieId: string;
  aanbestedingNaam: string;
  publicatieDatum: string;
  sluitingsDatum?: string;
  typePublicatie?: TypePublicatie;
  opdrachtgeverNaam?: string;
  link?: { href: string; title: string };
  opdrachtBeschrijving?: string;
  europees?: boolean;
}

const TENDERNED_ZOEK = 'https://www.tenderned.nl/aankondigingen/overzicht';

function tenderNetSearchUrl(naam: string): string {
  return `${TENDERNED_ZOEK}?opdrachtgeverNaam=${encodeURIComponent(`Gemeente ${naam}`)}`;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('nl-NL', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export default function AanbestedingenTab({ g }: { g: GemeenteInfo }) {
  const [data, setData] = useState<Publicatie[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchUrl = tenderNetSearchUrl(g.naam);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setData(null);
    setError(null);

    fetch(`/api/tenderned?gemeente=${encodeURIComponent(g.naam)}`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json: { content?: Publicatie[] }) => {
        if (cancelled) return;
        setData(json.content ?? []);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [g.naam]);

  return (
    <div className="p-4 space-y-4">
      <a
        href={searchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between w-full bg-blauw/5 border border-blauw/20 rounded-xl px-4 py-3 hover:bg-blauw/10 transition-colors group"
      >
        <div>
          <p className="text-sm font-semibold text-blauw">Zoek op TenderNed</p>
          <p className="text-xs text-grijs mt-0.5">Alle aanbestedingen van Gemeente {g.naam}</p>
        </div>
        <ExternalLink className="w-4 h-4 text-blauw flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
      </a>

      {loading && (
        <div className="flex items-center gap-2 text-grijs text-xs py-4 justify-center">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Recente aanbestedingen ophalen…</span>
        </div>
      )}

      {!loading && error && (
        <div className="flex items-start gap-2 text-xs text-grijs bg-bg-alt rounded-xl p-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500" />
          <span>Live data kon niet worden geladen. Gebruik de knop hierboven om aanbestedingen direct op TenderNed te bekijken.</span>
        </div>
      )}

      {!loading && !error && data !== null && data.length === 0 && (
        <div className="flex items-start gap-2 text-xs text-grijs bg-bg-alt rounded-xl p-3">
          <Search className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>Geen recente aanbestedingen gevonden voor <strong>Gemeente {g.naam}</strong>. Kijk op TenderNed voor het volledige overzicht.</span>
        </div>
      )}

      {!loading && data && data.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-grijs uppercase tracking-wider">
            {data.length} recente aanbesteding{data.length !== 1 ? 'en' : ''}
          </p>
          {data.slice(0, 10).map(p => (
            <a
              key={p.publicatieId}
              href={p.link?.href ?? `https://www.tenderned.nl/aankondigingen/overzicht/${p.publicatieId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-lijn rounded-xl p-3 hover:border-blauw/40 hover:bg-blauw/5 transition-colors group"
            >
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-grijs flex-shrink-0 mt-0.5 group-hover:text-blauw transition-colors" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-blauw leading-snug line-clamp-2 group-hover:underline">
                    {p.aanbestedingNaam || '(geen titel)'}
                  </p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {p.publicatieDatum && (
                      <span className="flex items-center gap-1 text-xs text-grijs">
                        <Calendar className="w-3 h-3" />
                        {formatDate(p.publicatieDatum)}
                      </span>
                    )}
                    {p.typePublicatie?.omschrijving && (
                      <span className="text-xs bg-blauw/10 text-blauw px-1.5 py-0.5 rounded-full">
                        {p.typePublicatie.omschrijving}
                      </span>
                    )}
                    {p.europees && (
                      <span className="text-xs bg-magenta/10 text-magenta px-1.5 py-0.5 rounded-full">Europees</span>
                    )}
                    {p.sluitingsDatum && (
                      <span className="text-xs text-grijs">
                        Sluit {formatDate(p.sluitingsDatum)}
                      </span>
                    )}
                  </div>
                </div>
                <ExternalLink className="w-3 h-3 text-grijs flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </a>
          ))}
          {data.length > 10 && (
            <a
              href={searchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-xs text-blauw hover:underline py-1"
            >
              Toon alle {data.length} aanbestedingen op TenderNed →
            </a>
          )}
        </div>
      )}

      <div className="text-xs text-grijs border-t border-lijn pt-3 mt-2 space-y-1">
        <p className="font-medium">Over TenderNed</p>
        <p>TenderNed is het nationale platform voor overheidsopdrachten. Aanbestedingen boven de Europese drempelwaarden zijn verplicht gepubliceerd.</p>
      </div>
    </div>
  );
}
