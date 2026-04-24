
import type { GemeenteInfo } from '../types';
import { subsidiePerPersoon } from '../types';

interface Props { gemeenten: GemeenteInfo[] }

function fmt(n: number) {
  if (n >= 1e9) return `\u20ac ${(n / 1e9).toFixed(1).replace('.', ',')} mld`;
  if (n >= 1e6) return `\u20ac ${Math.round(n / 1e6).toLocaleString('nl-NL')} mln`;
  return `\u20ac ${n.toLocaleString('nl-NL')}`;
}

export default function KpiBar({ gemeenten }: Props) {
  const verplicht = gemeenten.filter(g => g.sroi.status === 'Verplicht').length;
  const totalBijstand = gemeenten.reduce((s, g) => s + g.bijstand, 0);
  const totalBuig = gemeenten.reduce((s, g) => s + g.buigBudget, 0);
  const totalSubsidie = Object.entries(subsidiePerPersoon).reduce((sum, [key, val]) => {
    return sum + gemeenten.reduce((s, g) => s + (g.doelgroepen[key as keyof typeof g.doelgroepen]?.n ?? 0) * val, 0);
  }, 0);

  const stats = [
    { label: 'Gemeenten met SROI-plicht', value: `${verplicht}` },
    { label: 'Bijstandsgerechtigden', value: totalBijstand.toLocaleString('nl-NL') },
    { label: 'Totaal BUIG-budget', value: fmt(totalBuig) },
    { label: 'Potentieel subsidie arbeidsmarkt', value: fmt(totalSubsidie) },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-4 py-3 bg-white border-b border-lijn">
      {stats.map(s => (
        <div key={s.label} className="text-center">
          <div className="text-lg font-bold text-blauw">{s.value}</div>
          <div className="text-xs text-grijs">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
