
import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Download } from 'lucide-react';
import TopBar from './components/TopBar';
import KpiBar from './components/KpiBar';
import Sidebar from './components/Sidebar';
import NLMap from './components/NLMap';
import { useCBSData } from './hooks/useCBSData';
import type { GemeenteInfo } from './types';
import { doelgroepLabels, subsidiePerPersoon } from './types';

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

export default function App() {
  const { alle, loading } = useCBSData();
  const [zoek, setZoek] = useState('');
  const [geselecteerd, setGeselecteerd] = useState<GemeenteInfo | null>(null);
  const [exportSelected, setExportSelected] = useState<Map<string, GemeenteInfo>>(new Map());
  const [exportMode, setExportMode] = useState(false);

  // Ref zodat de Leaflet-click handler altijd de actuele waarde leest
  // zonder dat handleSelect opnieuw aangemaakt hoeft te worden.
  const exportModeRef = useRef(false);
  useEffect(() => { exportModeRef.current = exportMode; }, [exportMode]);

  const actief = useMemo(
    () => alle.filter(g => g.sroi.status !== 'In ontwikkeling').length,
    [alle]
  );

  const exportSelectedCodes = useMemo(
    () => new Set(exportSelected.keys()),
    [exportSelected]
  );

  // Lege deps: handleSelect is stabiel en leest exportMode via ref.
  const handleSelect = useCallback((g: GemeenteInfo) => {
    if (exportModeRef.current) {
      setExportSelected(prev => {
        const next = new Map(prev);
        if (next.has(g.gmCode)) next.delete(g.gmCode);
        else next.set(g.gmCode, g);
        return next;
      });
    } else {
      setGeselecteerd(g);
    }
  }, []);

  const toggleExportMode = useCallback(() => {
    setExportMode(m => !m);
    setExportSelected(new Map());
    setGeselecteerd(null);
  }, []);

  const csvHref = useMemo(() => {
    const items = Array.from(exportSelected.values());
    return items.length > 0 ? buildCsvHref(items) : '#';
  }, [exportSelected]);

  const csvFilename = 'sroi-export-' + new Date().toISOString().slice(0, 10) + '.csv';

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-bg-alt">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-magenta border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-grijs text-sm">CBS-data laden...</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar zoek={zoek} setZoek={setZoek} totaal={alle.length} actief={actief} />
      <KpiBar gemeenten={alle} />

      {/* Toolbar */}
      <div className="bg-white border-b border-lijn px-4 py-2 flex items-center gap-3 flex-shrink-0">
        {/* Legenda */}
        {!exportMode && (
          <div className="flex items-center gap-3 text-xs text-grijs flex-1 flex-wrap">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-green-600 inline-block" />Verplicht SROI
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-blue-300 inline-block" />Actief beleid
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-gray-400 inline-block" />In ontwikkeling
            </span>
          </div>
        )}

        {/* Export-modus: altijd zichtbaar zodra exportMode aan is */}
        {exportMode && (
          <div className="flex items-center gap-3 flex-1 flex-wrap">
            <span className="text-xs text-grijs">
              {exportSelected.size === 0
                ? 'Klik gemeenten op de kaart om te selecteren'
                : `${exportSelected.size} gemeente${exportSelected.size !== 1 ? 'n' : ''} geselecteerd`}
            </span>

            {/* Download altijd zichtbaar — disabled als niets geselecteerd */}
            <a
              href={exportSelected.size > 0 ? csvHref : undefined}
              download={exportSelected.size > 0 ? csvFilename : undefined}
              onClick={exportSelected.size === 0 ? (e) => e.preventDefault() : undefined}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors no-underline ${
                exportSelected.size > 0
                  ? 'bg-magenta text-white hover:bg-pink-700 cursor-pointer'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}>
              <Download className="w-3.5 h-3.5" />
              {exportSelected.size > 0
                ? `Download CSV (${exportSelected.size})`
                : 'Download CSV'}
            </a>

            {exportSelected.size > 0 && (
              <button
                onClick={() => setExportSelected(new Map())}
                className="text-xs text-grijs hover:text-blauw underline">
                Selectie wissen
              </button>
            )}
          </div>
        )}

        <button
          onClick={toggleExportMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex-shrink-0 ${
            exportMode
              ? 'bg-blauw text-white border-blauw'
              : 'bg-white text-grijs border-lijn hover:border-blauw hover:text-blauw'
          }`}>
          {exportMode ? 'Klaar' : 'Exporteer gemeenten'}
        </button>
      </div>

      {/* Hoofd-layout */}
      <main className="flex-1 overflow-hidden flex">
        <div className={`h-full relative transition-all duration-300 ${geselecteerd ? 'w-[60%]' : 'w-full'}`}>
          <NLMap
            gemeenten={alle}
            zoek={zoek}
            onSelect={handleSelect}
            exportMode={exportMode}
            exportSelected={exportSelectedCodes}
          />
        </div>
        {geselecteerd && (
          <div className="w-[40%] h-full flex-shrink-0 overflow-hidden">
            <Sidebar g={geselecteerd} onClose={() => setGeselecteerd(null)} />
          </div>
        )}
      </main>
    </div>
  );
}
