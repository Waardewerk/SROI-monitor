import type { GemeenteInfo } from '../../types';

export default function SuccessenTab({ g }: { g: GemeenteInfo }) {
  if (!g.succesverhalen || g.succesverhalen.length === 0) {
    return (
      <p className="text-xs text-grijs italic">
        Nog geen succesverhalen beschikbaar voor {g.naam}. Ken jij een goed voorbeeld?{' '}
        <a href="mailto:info@waardewerk.nl" className="text-magenta hover:underline">Laat het ons weten.</a>
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-blauw uppercase tracking-wide">Succesverhalen uit de praktijk</p>
      {g.succesverhalen.map((s, i) => (
        <div key={i} className="rounded-xl border border-lijn p-4 bg-bg-alt space-y-2">
          <p className="text-sm font-semibold text-blauw">{s.titel}</p>
          <p className="text-xs text-grijs leading-relaxed">{s.tekst}</p>
          {(s.url || s.bron || s.datum) && (
            <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-lijn">
              {s.datum && <span className="text-xs text-grijs">{s.datum}</span>}
              {s.url ? (
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-magenta hover:underline font-medium"
                >
                  {s.bron ?? 'Lees het volledige verhaal'} ↗
                </a>
              ) : s.bron ? (
                <span className="text-xs text-grijs italic">Bron: {s.bron}</span>
              ) : null}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
