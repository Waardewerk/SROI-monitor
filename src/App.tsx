
import { useState, useMemo, useCallback } from 'react';
import TopBar from './components/TopBar';
import KpiBar from './components/KpiBar';
import GemeenteDetail from './components/GemeenteDetail';
import NLMap from './components/NLMap';
import { useCBSData } from './hooks/useCBSData';
import type { GemeenteInfo } from './types';
import { STATUS_COLOR } from './types';

export default function App() {
  const { alle, loading } = useCBSData();
  const [zoek, setZoek] = useState('');
  const [geselecteerd, setGeselecteerd] = useState<GemeenteInfo | null>(null);
  const [view, setView] = useState<'kaart' | 'lijst'>('kaart');

  const gefilterd = useMemo(() => {
    const q = zoek.toLowerCase();
    return alle.filter(g =>
      !q || g.naam.toLowerCase().includes(q) || (g.provincie?.toLowerCase().includes(q) ?? false)
    );
  }, [alle, zoek]);

  const handleSelect = useCallback((g: GemeenteInfo) => {
    setGeselecteerd(g);
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-bg-alt">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-magenta border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-grijs text-sm">CBS-data laden\u2026</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar zoek={zoek} setZoek={setZoek} totaal={alle.length} gevonden={gefilterd.length} />
      <KpiBar gemeenten={alle} />

      {/* View toggle + legend */}
      <div className="bg-white border-b border-lijn px-4 py-2 flex items-center gap-4 flex-wrap">
        <div className="flex rounded-lg overflow-hidden border border-lijn text-xs">
          {(['kaart', 'lijst'] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-3 py-1.5 capitalize transition-colors ${view === v ? 'bg-blauw text-white' : 'bg-white text-grijs hover:bg-bg-alt'}`}>
              {v === 'kaart' ? '\ud83d\uddfa\ufe0f Kaart' : '\ud83d\udccb Lijst'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs text-grijs flex-wrap">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-green-600 inline-block" />Verplicht SROI</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-blue-300 inline-block" />Actief beleid</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-gray-400 inline-block" />In ontwikkeling</span>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-hidden relative">
        {view === 'kaart' ? (
          <NLMap gemeenten={alle} zoek={zoek} onSelect={handleSelect} />
        ) : (
          <div className="h-full overflow-y-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {gefilterd.map(g => (
                <button key={g.gmCode} onClick={() => setGeselecteerd(g)}
                  className="card text-left hover:shadow-md hover:border-magenta/30 transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-blauw text-sm">{g.naam}</p>
                      <p className="text-xs text-grijs">{g.provincie ?? ''}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_COLOR[g.sroi.status]}`}>{g.sroi.pct}%</span>
                  </div>
                  <div className="flex gap-3 text-xs text-grijs mt-3">
                    <span><strong className="text-blauw">{g.bijstand.toLocaleString('nl-NL')}</strong> bijstand</span>
                    {g.werkloosheid && <span><strong className="text-blauw">{g.werkloosheid}%</strong> WW</span>}
                  </div>
                  {g.sroi.uitvoerder && <p className="text-xs text-magenta mt-2 truncate">{g.sroi.uitvoerder}</p>}
                  {g.isSeeded && (
                    <div className="mt-2 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-magenta inline-block" />
                      <span className="text-xs text-grijs">Gedetailleerd profiel</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
            {gefilterd.length === 0 && (
              <div className="text-center py-16 text-grijs">Geen gemeenten gevonden voor &quot;{zoek}&quot;</div>
            )}
          </div>
        )}
      </main>

      {geselecteerd && <GemeenteDetail g={geselecteerd} onClose={() => setGeselecteerd(null)} />}
    </div>
  );
}
