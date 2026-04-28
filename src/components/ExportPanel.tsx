
import { useState } from 'react';
import { Download, X, Check } from 'lucide-react';
import type { GemeenteInfo } from '../types';
import { doelgroepLabels, subsidiePerPersoon } from '../types';

interface Props {
  selected: Map<string, GemeenteInfo>;
  onClear: () => void;
}

const D_KEYS = ['bijstand', 'nuggers', 'statushouders', 'vsv', 'arbeidsbeperkt', 'ouderen55plus'] as const;

function downloadCSV(gemeenten: GemeenteInfo[]) {
  const headers = [
    'Gemeente', 'GmCode', 'Provincie', 'SROI status', 'SROI%',
    'Drempelwaarde (EUR)', 'Uitvoerder', 'Bijstand personen',
    'BUIG-budget (EUR)', 'Reintegratie (EUR)',
    ...D_KEYS.map(k => doelgroepLabels[k] + ' (n)'),
    ...D_KEYS.map(k => doelgroepLabels[k] + ' bereikbaarheid%'),
    'Totaal subsidiepotentieel (EUR)',
  ];

  const rows = gemeenten.map(g => {
    const sub = D_KEYS.reduce((s, k) => s + g.doelgroepen[k].n * (subsidiePerPersoon[k] ?? 0), 0);
    return [
      g.naam, g.gmCode, g.provincie ?? '', g.sroi.status, g.sroi.pct,
      g.sroi.drempel ?? '', g.sroi.uitvoerder ?? '',
      g.bijstand, g.buigBudget, g.reintegratiebudget,
      ...D_KEYS.map(k => g.doelgroepen[k].n),
      ...D_KEYS.map(k => g.doelgroepen[k].bereikbaarheid),
      Math.round(sub),
    ];
  });

  const csv = [headers, ...rows]
    .map(row => row.map(v => '"' + String(v ?? '').replace(/"/g, '""') + '"').join(';'))
    .join('\r\n');

  const bom = '\uFEFF';
  const filename = 'sroi-export-' + new Date().toISOString().slice(0, 10) + '.csv';

  // Most reliable cross-browser download
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.position = 'fixed';
  link.style.top = '-9999px';
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 1000);
}

export default function ExportPanel({ selected, onClear }: Props) {
  const [exported, setExported] = useState(false);
  const items = Array.from(selected.values());

  function handleExport() {
    if (items.length === 0) return;
    downloadCSV(items);
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  }

  if (selected.size === 0) return null;

  const preview = items.slice(0, 3).map(g => g.naam).join(', ')
    + (items.length > 3 ? ` +${items.length - 3}` : '');

  return (
    <div
      className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-blauw text-white rounded-2xl shadow-2xl px-5 py-3 flex items-center gap-4"
      style={{ zIndex: 99999, minWidth: '340px' }}>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold">
          {selected.size} gemeente{selected.size !== 1 ? 'n' : ''} geselecteerd
        </p>
        <p className="text-xs text-white/60 truncate">{preview}</p>
      </div>
      <button
        onClick={handleExport}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all flex-shrink-0 ${
          exported
            ? 'bg-green-500'
            : 'bg-magenta hover:bg-pink-600 active:scale-95'
        }`}>
        {exported
          ? <><Check className="w-4 h-4" /> Gedownload!</>
          : <><Download className="w-4 h-4" /> Export CSV</>}
      </button>
      <button
        onClick={onClear}
        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
        title="Selectie wissen">
        <X className="w-4 h-4 text-white/60" />
      </button>
    </div>
  );
}
