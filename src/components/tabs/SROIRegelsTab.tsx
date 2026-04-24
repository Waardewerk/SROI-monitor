
import type { GemeenteInfo } from '../../types';

export default function SROIRegelsTab({ g }: { g: GemeenteInfo }) {
  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {[
          { l: 'SROI-percentage', v: `${g.sroi.pct}%` },
          { l: 'Drempelwaarde', v: g.sroi.drempel ? `\u20ac ${g.sroi.drempel.toLocaleString('nl-NL')}` : 'n.v.t.' },
          { l: 'Monitoring', v: g.sroi.monitoring ?? '\u2014' },
          { l: 'Status', v: g.sroi.status },
        ].map(({ l, v }) => (
          <div key={l} className="bg-bg-alt rounded-lg p-2.5">
            <p className="text-xs text-grijs">{l}</p>
            <p className="text-sm font-semibold text-blauw">{v}</p>
          </div>
        ))}
      </div>
      {g.sroi.uitvoerder && (
        <div className="bg-bg-alt rounded-lg p-3">
          <p className="text-xs text-grijs mb-1">Uitvoerder</p>
          <p className="text-sm font-medium text-blauw">{g.sroi.uitvoerder}</p>
          {g.sroi.registratiesysteem && (
            <a href={`mailto:${g.sroi.registratiesysteem}`} className="text-xs text-magenta hover:underline mt-0.5 block">{g.sroi.registratiesysteem}</a>
          )}
        </div>
      )}
      {g.bouwblokwaarden && g.bouwblokwaarden.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-blauw mb-2">Bouwblokwaarden</p>
          <div className="divide-y divide-lijn rounded-xl border border-lijn overflow-hidden">
            {g.bouwblokwaarden.map((item, i) => (
              <div key={i} className="flex justify-between items-center px-3 py-2 text-xs hover:bg-bg-alt">
                <span className="text-grijs">{item.label}</span>
                <span className="font-semibold text-blauw ml-2 whitespace-nowrap">{item.waarde}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {!g.isSeeded && <p className="text-xs text-grijs italic">Gedetailleerde SROI-regels volgen binnenkort.</p>}
    </div>
  );
}
