
import type { GemeenteInfo } from '../../types';
import { doelgroepLabels, doelgroepKleuren, subsidiePerPersoon } from '../../types';

function fmt(n: number) {
  if (n >= 1e6) return `\u20ac ${(n/1e6).toFixed(1)} mln`;
  if (n >= 1e3) return `\u20ac ${Math.round(n/1e3)}k`;
  return `\u20ac ${n}`;
}

export default function DoelgroepenTab({ g }: { g: GemeenteInfo }) {
  const doelgroepen = Object.entries(g.doelgroepen) as [keyof typeof g.doelgroepen, { n: number; bereikbaarheid: number }][];
  const totaal = doelgroepen.reduce((s, [, v]) => s + v.n, 0);
  const totaalSubsidie = doelgroepen.reduce((s, [k, v]) => s + v.n * (subsidiePerPersoon[k] ?? 0), 0);

  return (
    <div className="space-y-3 p-4">
      <div className="bg-green-50 rounded-xl p-3 border border-green-100">
        <p className="text-xs text-grijs">Totaal arbeidspotentieel</p>
        <p className="text-2xl font-bold text-green-700">{totaal.toLocaleString('nl-NL')}</p>
        <p className="text-xs text-grijs">personen in {g.naam}</p>
      </div>
      {doelgroepen.map(([key, val]) => (
        <div key={key}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-blauw flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full inline-block flex-shrink-0" style={{ background: doelgroepKleuren[key] }} />
              {doelgroepLabels[key]}
            </span>
            <span className="text-xs font-bold text-blauw">{val.n.toLocaleString('nl-NL')}</span>
          </div>
          <div className="h-1.5 bg-lijn rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${val.bereikbaarheid}%`, background: doelgroepKleuren[key] }} />
          </div>
          <div className="flex justify-between text-xs text-grijs mt-0.5">
            <span>Bereikbaarheid via SROI {val.bereikbaarheid}%</span>
            <span>{fmt(val.n * (subsidiePerPersoon[key] ?? 0))} subsidie</span>
          </div>
        </div>
      ))}
      <div className="border-t border-lijn pt-2 flex justify-between text-xs">
        <span className="text-grijs">Totaal subsidiepotentieel</span>
        <span className="font-bold text-blauw">{fmt(totaalSubsidie)}</span>
      </div>
    </div>
  );
}
