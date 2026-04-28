
import type { GemeenteInfo, BouwblokWaarde } from '../../types';

function groupBySectie(items: BouwblokWaarde[]): { sectie: string; items: BouwblokWaarde[] }[] {
  const map = new Map<string, BouwblokWaarde[]>();
  for (const item of items) {
    const key = item.sectie ?? 'Bouwblokwaarden';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  }
  return Array.from(map.entries()).map(([sectie, items]) => ({ sectie, items }));
}

export default function SROIRegelsTab({ g }: { g: GemeenteInfo }) {
  const groepen = g.bouwblokwaarden ? groupBySectie(g.bouwblokwaarden) : [];

  return (
    <div className="p-4 space-y-4">
      {/* Kerncijfers */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { l: 'SROI-percentage', v: `${g.sroi.pct}%` },
          { l: 'Drempelwaarde', v: g.sroi.drempel ? `€ ${g.sroi.drempel.toLocaleString('nl-NL')}` : 'n.v.t.' },
          { l: 'Monitoring', v: g.sroi.monitoring ?? '—' },
          { l: 'Methode', v: g.sroi.methode ?? g.sroi.status },
        ].map(({ l, v }) => (
          <div key={l} className="bg-bg-alt rounded-lg p-2.5">
            <p className="text-xs text-grijs">{l}</p>
            <p className="text-sm font-semibold text-blauw">{v}</p>
          </div>
        ))}
      </div>

      {/* Uitvoerder */}
      {g.sroi.uitvoerder && (
        <div className="bg-bg-alt rounded-lg p-3">
          <p className="text-xs text-grijs mb-1">Uitvoerder</p>
          <p className="text-sm font-medium text-blauw">{g.sroi.uitvoerder}</p>
          {g.sroi.registratiesysteem && (
            <a href={`mailto:${g.sroi.registratiesysteem}`}
               className="text-xs text-magenta hover:underline mt-0.5 block">
              {g.sroi.registratiesysteem}
            </a>
          )}
        </div>
      )}

      {/* Bouwblokwaarden — gegroepeerd per sectie */}
      {groepen.map(({ sectie, items }) => (
        <div key={sectie}>
          <p className="text-xs font-semibold text-blauw mb-2">{sectie}</p>
          <div className="divide-y divide-lijn rounded-xl border border-lijn overflow-hidden">
            {items.map((item, i) => (
              <div key={i} className="flex justify-between items-start px-3 py-2 text-xs hover:bg-bg-alt gap-2">
                <span className="text-grijs flex-1">{item.label}</span>
                <span className="font-semibold text-blauw whitespace-nowrap">{item.waarde}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Erkende lokale partners */}
      {g.erkendepartners && g.erkendepartners.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-blauw mb-2">Erkende lokale partners</p>
          <div className="flex flex-wrap gap-2">
            {g.erkendepartners.map((partner, i) => (
              <span key={i} className="bg-bg-alt text-blauw text-xs px-2.5 py-1 rounded-full border border-lijn">
                {partner}
              </span>
            ))}
          </div>
        </div>
      )}

      {!g.isSeeded && (
        <p className="text-xs text-grijs italic">Gedetailleerde SROI-regels volgen binnenkort.</p>
      )}
    </div>
  );
}
