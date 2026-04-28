
import { useState } from 'react';
import { Download, X, Check } from 'lucide-react';
import type { GemeenteInfo } from '../types';
import { doelgroepLabels, subsidiePerPersoon } from '../types';

interface Props {
  gemeenten: GemeenteInfo[];
  selected: Set<string>;
  onClear: () => void;
}

const D_KEYS = ['bijstand', 'nuggers', 'statushouders', 'vsv', 'arbeidsbeperkt', 'ouderen55plus'] as const;

function exportCSV(gemeenten: GemeenteInfo[]) {
  const headers = [
    'Gemeente', 'GmCode', 'Provincie', 'SROI status', 'SROI%', 'Drempelwaarde (EUR)',
    'Uitvoerder', 'Bijstand personen', 'BUIG-budget (EUR)', 'Reintegratie (EUR)',
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

  const sep = ';';
  const csv = [headers, ...rows]
    .map(row => row.map(v => '"' + String(v ?? '').replace(/"/g, '""') + '"').join(sep))
    .join('\r\n');

  // BOM for Excel
  const content = '\uFEFF' + csv;
  const filename = 'sroi-export-' + new Date().toISOString().slice(0, 10) + '.csv';

  // Try Blob approach, fallback to data URI
  try {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 500);
  } catch {
    // Fallback: data URI
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(content);
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

export default function ExportPanel({ gemeenten, selected, onClear }: Props) {
  const [exported, setExported] = useState(false);
  const selectedGemeenten = gemeenten.filter(g => selected.has(g.gmCode));

  function handleExport() {
    if (selectedGemeenten.length === 0) return;
    exportCSV(selectedGemeenten);
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  }

  if (selected.size === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-blauw text-white rounded-2xl shadow-2xl px-5 py-3 flex items-center gap-4" style={{ minWidth: '320px' }}>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">{selected.size} gemeente{selected.size !== 1 ? 'n' : ''} geselecteerd</p>
        <p className="text-xs text-white/60 truncate">
          {selectedGemeenten.slice(0, 3).map(g => g.naam).join(', ')}
          {selectedGemeenten.length > 3 ? ` +${selectedGemeenten.length - 3}` : ''}
        </p>
      </div>
      <button
        onClick={handleExport}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all flex-shrink-0 ${
          exported
            ? 'bg-green-500 text-white'
            : 'bg-magenta text-white hover:bg-pink-600 active:scale-95'
        }`}>
        {exported
          ? <><Check className="w-4 h-4" /> Klaar!</>
          : <><Download className="w-4 h-4" /> Export CSV</>
        }
      </button>
      <button onClick={onClear} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0">
        <X className="w-4 h-4 text-white/70" />
      </button>
    </div>
  );
}
