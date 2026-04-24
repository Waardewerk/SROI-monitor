
import type { GemeenteInfo } from '../types';

interface Props { gemeenten: GemeenteInfo[] }

function fmt(n: number) {
  if (n >= 1e6) return `${Math.round(n / 1000).toLocaleString('nl-NL')}.000`.replace('.000.000', ' mln');
  return n.toLocaleString('nl-NL');
}

export default function KpiBar({ gemeenten }: Props) {
  const actief = gemeenten.filter(g => g.sroi.status !== 'In ontwikkeling').length;
  const totalBijstand = gemeenten.reduce((s, g) => s + g.bijstand, 0);
  const totalNuggers = gemeenten.reduce((s, g) => s + g.doelgroepen.nuggers.n, 0);
  const avgSroi = (gemeenten.reduce((s, g) => s + g.sroi.pct, 0) / (gemeenten.length || 1)).toFixed(1);

  return (
    <div className="grid grid-cols-4 bg-white border-b border-lijn">
      {[
        { v: String(actief), l: 'Gemeenten met SROI-beleid', sub: '+23 dit jaar', c: 'text-green-600' },
        { v: fmt(totalBijstand), l: 'Totaal arbeidspotentieel', sub: 'bereikbaar via SROI', c: 'text-blue-600' },
        { v: `~${fmt(totalNuggers)}`, l: 'NUGGERS landelijk', sub: 'niet-uitkeringsgerechtigden', c: 'text-purple-600' },
        { v: `${avgSroi}%`, l: 'Gemiddeld SROI-percentage', sub: 'van aanneemsom', c: 'text-magenta' },
      ].map(({ v, l, sub, c }) => (
        <div key={l} className="px-5 py-3 border-r border-lijn last:border-r-0">
          <p className={`text-2xl font-bold ${c}`}>{v}</p>
          <p className="text-xs font-medium text-blauw">{l}</p>
          <p className="text-xs text-grijs">{sub}</p>
        </div>
      ))}
    </div>
  );
}
