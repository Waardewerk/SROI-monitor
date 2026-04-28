
import { useState, useMemo, useCallback } from 'react';
import TopBar from './components/TopBar';
import KpiBar from './components/KpiBar';
import Sidebar from './components/Sidebar';
import NLMap from './components/NLMap';
import ExportPanel from './components/ExportPanel';
import { useCBSData } from './hooks/useCBSData';
import type { GemeenteInfo } from './types';

export default function App() {
  const { alle, loading } = useCBSData();
  const [zoek, setZoek] = useState('');
  const [geselecteerd, setGeselecteerd] = useState<GemeenteInfo | null>(null);
  const [exportSelected, setExportSelected] = useState<Set<string>>(new Set());
  const [exportMode, setExportMode] = useState(false);

  const actief = useMemo(
    () => alle.filter(g => g.sroi.status !== 'In ontwikkeling').length,
    [alle]
  );

  const handleSelect = useCallback((g: GemeenteInfo) => {
    if (exportMode) {
      setExportSelected(prev => {
        const next = new Set(prev);
        if (next.has(g.gmCode)) next.delete(g.gmCode);
        else next.add(g.gmCode);
        return next;
      });
    } else {
      setGeselecteerd(g);
    }
  }, [exportMode]);

  const toggleExportMode = useCallback(() => {
    setExportMode(m => !m);
    setExportSelected(new Set());
    setGeselecteerd(null);
  }, []);

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
        <div className="flex items-center gap-3 text-xs text-grijs flex-1 flex-wrap">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-green-600 inline-block" />
            Verplicht SROI
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-blue-300 inline-block" />
            Actief beleid
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-gray-400 inline-block" />
            In ontwikkeling
          </span>
        </div>
        <button
          onClick={toggleExportMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            exportMode
              ? 'bg-blauw text-white border-blauw'
              : 'bg-white text-grijs border-lijn hover:border-blauw hover:text-blauw'
          }`}>
          {exportMode ? 'Selectiemodus aan' : 'Exporteer gemeenten'}
        </button>
      </div>

      {/* Main — map left, sidebar right */}
      <main className="flex-1 overflow-hidden flex">
        <div className={`h-full relative transition-all duration-300 ${geselecteerd ? 'w-[60%]' : 'w-full'}`}>
          <NLMap
            gemeenten={alle}
            zoek={zoek}
            onSelect={handleSelect}
            exportMode={exportMode}
            exportSelected={exportSelected}
          />
        </div>

        {geselecteerd && (
          <div className="w-[40%] h-full flex-shrink-0 overflow-hidden">
            <Sidebar g={geselecteerd} onClose={() => setGeselecteerd(null)} />
          </div>
        )}
      </main>

      {exportMode && (
        <ExportPanel
          gemeenten={alle}
          selected={exportSelected}
          onClear={() => setExportSelected(new Set())}
        />
      )}
    </div>
  );
}
