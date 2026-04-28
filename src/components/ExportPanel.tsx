
import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Download, X } from 'lucide-react';
import type { GemeenteInfo } from '../types';
import { doelgroepLabels, subsidiePerPersoon } from '../types';

interface Props {
  selected: Map<string, GemeenteInfo>;
  onClear: () => void;
}

const D_KEYS = ['bijstand', 'nuggers', 'statushouders', 'vsv', 'arbeidsbeperkt', 'ouderen55plus'] as const;

function buildCsvHref(gemeenten: GemeenteInfo[]): string {
  const headers = [
    'Gemeente', 'GmCode', 'Provincie', 'SROI status', 'SROI%',
    'Drempelwaarde (EUR)', 'Uitvoerder', 'Bijstand personen',
    ...D_KEYS.map(k => doelgroepLabels[k] + ' (n)'),
    ...D_KEYS.map(k => doelgroepLabels[k] + ' bereikbaarheid%'),
    'Totaal subsidiepotentieel (EUR)',
  ];
  const rows = gemeenten.map(g => {
    const sub = D_KEYS.reduce((s, k) => s + g.doelgroepen[k].n * (subsidiePerPersoon[k] ?? 0), 0);
    return [
      g.naam, g.gmCode, g.provincie ?? '', g.sroi.status, g.sroi.pct,
      g.sroi.drempel ?? '', g.sroi.uitvoerder ?? '', g.bijstand,
      ...D_KEYS.map(k => g.doelgroepen[k].n),
      ...D_KEYS.map(k => g.doelgroepen[k].bereikbaarheid),
      Math.round(sub),
    ];
  });
  const csv = [headers, ...rows]
    .map(row => row.map(v => '"' + String(v ?? '').replace(/"/g, '""') + '"').join(';'))
    .join('\r\n');
  return 'data:text/csv;charset=utf-8,' + encodeURIComponent('\uFEFF' + csv);
}

export default function ExportPanel({ selected, onClear }: Props) {
  const items = useMemo(() => Array.from(selected.values()), [selected]);
  const href = useMemo(() => items.length > 0 ? buildCsvHref(items) : '#', [items]);
  const filename = 'sroi-export-' + new Date().toISOString().slice(0, 10) + '.csv';
  const preview = items.slice(0, 3).map(g => g.naam).join(', ')
    + (items.length > 3 ? ` +${items.length - 3}` : '');

  if (selected.size === 0) return null;

  // Portal: renders into document.body, completely outside overflow-hidden parents
  return createPortal(
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 99999,
      minWidth: '340px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      background: '#1a1a2e',
      color: 'white',
      borderRadius: '16px',
      padding: '12px 20px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>
          {selected.size} gemeente{selected.size !== 1 ? 'n' : ''} geselecteerd
        </p>
        <p style={{ margin: 0, fontSize: '12px', opacity: 0.6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {preview}
        </p>
      </div>
      <a
        href={href}
        download={filename}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 16px',
          borderRadius: '12px',
          background: '#C2185B',
          color: 'white',
          textDecoration: 'none',
          fontSize: '13px',
          fontWeight: 700,
          flexShrink: 0,
          whiteSpace: 'nowrap',
        }}>
        <Download size={16} />
        Download CSV
      </a>
      <button
        onClick={onClear}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'rgba(255,255,255,0.6)',
          cursor: 'pointer',
          padding: '6px',
          borderRadius: '8px',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
        }}>
        <X size={16} />
      </button>
    </div>,
    document.body
  );
}
