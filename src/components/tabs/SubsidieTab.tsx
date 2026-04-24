
import type { GemeenteInfo } from '../../types';
import { subsidiePerPersoon, doelgroepLabels } from '../../types';

function fmt(n: number) {
  if (n >= 1e6) return `\u20ac ${(n/1e6).toFixed(1).replace('.', ',')} mln`;
  if (n >= 1e3) return `\u20ac ${Math.round(n/1e3).toLocaleString('nl-NL')}k`;
  return `\u20ac ${n.toLocaleString('nl-NL')}`;
}

export default function SubsidieTab({ g }: { g: GemeenteInfo }) {
  const items = (Object.entries(g.doelgroepen) as [keyof typeof g.doelgroepen, { n: number; bereikbaarheid: number }][])
    .map(([key, val]) => ({
      label: doelgroepLabels[key],
      n: val.n,
      bereikbaar: Math.round(val.n * val.bereikbaarheid / 100),
      subsidie: subsidiePerPersoon[key] ?? 0,
    }));
  const totaal = items.reduce((s, i) => s + i.bereikbaar * i.subsidie, 0);

  return (
    <div className="p-4 space-y-3">
      <div className="bg-green-50 border border-green-100 rounded-xl p-3">
        <p className="text-xs text-grijs">Totaal subsidiepotentieel</p>
        <p className="text-xl font-bold text-green-700">{fmt(totaal)}</p>
        <p className="text-xs text-grijs">bij volledige benutting bereikbare doelgroepen</p>
      </div>
      <div className="divide-y divide-lijn rounded-xl border border-lijn overflow-hidden">
        <div className="grid grid-cols-4 px-3 py-2 bg-bg-alt text-xs font-semibold text-grijs">
          <span>Doelgroep</span><span className="text-right">Bereikbaar</span><span className="text-right">Per persoon</span><span className="text-right">Totaal</span>
        </div>
        {items.map(item => (
          <div key={item.label} className="grid grid-cols-4 px-3 py-2 text-xs hover:bg-bg-alt">
            <span className="text-blauw">{item.label}</span>
            <span className="text-right text-grijs">{item.bereikbaar.toLocaleString('nl-NL')}</span>
            <span className="text-right text-grijs">{fmt(item.subsidie)}</span>
            <span className="text-right font-semibold text-blauw">{fmt(item.bereikbaar * item.subsidie)}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-grijs italic">Subsidiebedragen zijn indicatief op basis van CBS-normen.</p>
    </div>
  );
}
