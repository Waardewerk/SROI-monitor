import type { GemeenteInfo } from '../../types';
import { doelgroepLabels, doelgroepKleuren, subsidiePerPersoon } from '../../types';
import { Download } from 'lucide-react';

function fmtGeld(n: number) {
  if (n >= 1e6) return `€ ${(n / 1e6).toFixed(1)} mln`;
  if (n >= 1e3) return `€ ${Math.round(n / 1e3)}k`;
  return `€ ${n}`;
}

function fmtAantal(n: number) {
  return n.toLocaleString('nl-NL');
}

function downloadCSV(g: GemeenteInfo) {
  const doelgroepen = Object.entries(g.doelgroepen) as [keyof typeof g.doelgroepen, { n: number; bereikbaarheid: number }][];
  const totaal = doelgroepen.reduce((s, [, v]) => s + v.n, 0);
  const totaalSubsidie = doelgroepen.reduce((s, [k, v]) => s + v.n * (subsidiePerPersoon[k] ?? 0), 0);

  const rows = [
    ['Gemeente', 'GM-code', 'Provincie', 'SROI %', 'SROI status', 'Drempel (€)'],
    [g.naam, g.gmCode, g.provincie ?? '', String(g.sroi.pct), g.sroi.status, String(g.sroi.drempel ?? '')],
    [],
    ['Doelgroep', 'Aantal', 'Bereikbaarheid %', 'Subsidiepotentieel (€)'],
    ...doelgroepen.map(([k, v]) => [
      doelgroepLabels[k],
      String(v.n),
      String(v.bereikbaarheid),
      String(v.n * (subsidiePerPersoon[k] ?? 0)),
    ]),
    [],
    ['Totaal arbeidspotentieel', String(totaal)],
    ['Totaal subsidiepotentieel', String(totaalSubsidie)],
  ];

  const csv = rows.map(r => r.map(c => `"${c}"`).join(';')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sroi-doelgroepen-${g.naam.toLowerCase().replace(/\s+/g, '-')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function DoelgroepenTab({ g }: { g: GemeenteInfo }) {
  const doelgroepen = Object.entries(g.doelgroepen) as [keyof typeof g.doelgroepen, { n: number; bereikbaarheid: number }][];
  const totaal = doelgroepen.reduce((s, [, v]) => s + v.n, 0);
  const totaalSubsidie = doelgroepen.reduce((s, [k, v]) => s + v.n * (subsidiePerPersoon[k] ?? 0), 0);
  const bereikbaar = doelgroepen.reduce((s, [, v]) => s + Math.round(v.n * v.bereikbaarheid / 100), 0);

  return (
    <div className="space-y-4 p-4">

      {/* Totaalkaarten */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-blauw rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-white">{fmtAantal(totaal)}</p>
          <p className="text-xs text-white/70 mt-0.5">arbeidspotentieel</p>
        </div>
        <div className="bg-bg-alt rounded-xl p-3 text-center border border-lijn">
          <p className="text-xl font-bold text-blauw">{fmtAantal(bereikbaar)}</p>
          <p className="text-xs text-grijs mt-0.5">bereikbaar via SROI</p>
        </div>
        <div className="bg-bg-alt rounded-xl p-3 text-center border border-lijn">
          <p className="text-xl font-bold text-blauw">{fmtGeld(totaalSubsidie)}</p>
          <p className="text-xs text-grijs mt-0.5">subsidiepotentieel</p>
        </div>
      </div>

      {/* Doelgroepkaartjes */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-grijs uppercase tracking-wider">Doelgroepen</p>
        {doelgroepen.map(([key, val]) => {
          const subsPerPersoon = subsidiePerPersoon[key] ?? 0;
          const bereikbaarN = Math.round(val.n * val.bereikbaarheid / 100);
          return (
            <div key={key} className="border border-lijn rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 px-3 py-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: doelgroepKleuren[key] }}
                />
                <span className="text-xs font-semibold text-blauw flex-1">{doelgroepLabels[key]}</span>
                <span className="text-base font-bold text-blauw">{fmtAantal(val.n)}</span>
              </div>
              {/* Voortgangsbalk */}
              <div className="px-3 pb-1">
                <div className="h-1.5 bg-lijn rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${val.bereikbaarheid}%`, background: doelgroepKleuren[key] }}
                  />
                </div>
              </div>
              {/* Subtijl */}
              <div className="grid grid-cols-2 border-t border-lijn">
                <div className="px-3 py-1.5 border-r border-lijn">
                  <p className="text-xs text-grijs">Bereikbaar via SROI</p>
                  <p className="text-xs font-semibold text-blauw">{val.bereikbaarheid}% · {fmtAantal(bereikbaarN)} personen</p>
                </div>
                <div className="px-3 py-1.5">
                  <p className="text-xs text-grijs">Subsidiepotentieel</p>
                  <p className="text-xs font-semibold text-blauw">{fmtGeld(val.n * subsPerPersoon)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bron + export */}
      <div className="flex items-center justify-between border-t border-lijn pt-3">
        <p className="text-xs text-grijs">Bron: CBS Statline, schatting op basis van bijstandscijfers</p>
        <button
          onClick={() => downloadCSV(g)}
          className="flex items-center gap-1.5 text-xs text-blauw font-medium hover:underline"
        >
          <Download className="w-3.5 h-3.5" />
          CSV
        </button>
      </div>
    </div>
  );
}
