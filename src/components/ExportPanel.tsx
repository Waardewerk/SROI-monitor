
import { useState } from 'react';
import { Download, X, Check } from 'lucide-react';
import type { GemeenteInfo } from '../types';
import { doelgroepLabels, subsidiePerPersoon } from '../types';

interface Props {
  gemeenten: GemeenteInfo[];
  selected: Set<string>;
  onToggle: (gmCode: string) => void;
  onClear: () => void;
}

function exportCSV(gemeenten: GemeenteInfo[]) {
  const dKeys = ['bijstand', 'nuggers', 'statushouders', 'vsv', 'arbeidsbeperkt', 'ouderen55plus'] as const;
  const headers = [
    'Gemeente', 'GmCode', 'Provincie', 'Status SROI', 'SROI%', 'Drempelwaarde (EUR)',
    'Uitvoerder', 'Bijstand personen', 'BUIG-budget (EUR)', 'Reintegratie (EUR)',
    ...dKeys.map(k => doelgroepLabels[k] + ' (n)'),
    ...dKeys.map(k => doelgroepLabels[k] + ' bereikbaarheid%'),
    'Totaal subsidiepotentieel (EUR)',
  ];

  const rows = gemeenten.map(g => {
    const totalSubsidie = dKeys.reduce((s, k) => s + g.doelgroepen[k].n * (subsidiePerPersoon[k] ?? 0), 0);
    return [
      g.naam, g.gmCode, g.provincie ?? '', g.sroi.status, g.sroi.pct,
      g.sroi.drempel ?? '',
      g.sroi.uitvoerder ?? '',
      g.bijstand, g.buigBudget, g.reintegratiebudget,
      ...dKeys.map(k => g.doelgroepen[k].n),
      ...dKeys.map(k => g.doelgroepen[k].bereikbaarheid),
      Math.round(totalSubsidie),
    ];
  });

  const csv = [headers, ...rows]
    .map(row => row.map(cell => '"' + String(cell).replace(/"/g, '""') + '"').join(';'))
    .join('\n');

  const bom = '\uFEFF';
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sroi-monitor-export-' + new Date().toISOString().slice(0, 10) + '.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function ExportPanel({ gemeenten, selected, onClear }: Props) {
  const [exported, setExported] = useState(false);
  const selectedGemeenten = gemeenten.filter(g => selected.has(g.gmCode));

  function handleExport() {
    exportCSV(selectedGemeenten);
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  }

  if (selected.size === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-blauw text-white rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-4 min-w-72">
      <div className="flex-1">
        <p className="text-sm font-semibold">{selected.size} gemeente{selected.size > 1 ? 'n' : ''} geselecteerd</p>
        <p className="text-xs text-white/60">Klik gemeenten op de kaart om te (de)selecteren</p>
      </div>
      <button onClick={handleExport}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
          exported ? 'bg-green-500 text-white' : 'bg-magenta text-white hover:bg-magenta/80'
        }`}>
        {exported ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
        {exported ? 'Geexporteerd!' : 'Export CSV'}
      </button>
      <button onClick={onClear} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
        <X className="w-4 h-4 text-white/70" />
      </button>
    </div>
  );
}
