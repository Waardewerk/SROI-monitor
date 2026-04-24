
import { Search } from 'lucide-react';

interface Props {
  zoek: string;
  setZoek: (v: string) => void;
  totaal: number;
  gevonden: number;
}

export default function TopBar({ zoek, setZoek, totaal, gevonden }: Props) {
  return (
    <header className="bg-blauw text-white px-6 py-4 flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <img src="/waardewerk-logo.jpg" alt="Waardewerk" className="h-7 w-auto" onError={e => (e.currentTarget.style.display = 'none')} />
          <span className="text-xs font-semibold tracking-widest uppercase text-white/50">SROI Monitor</span>
        </div>
        <h1 className="text-xl font-semibold">Social Return Nederland</h1>
        <p className="text-white/50 text-xs mt-0.5">{gevonden} van {totaal} gemeenten</p>
      </div>
      <div className="relative w-full md:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input
          value={zoek}
          onChange={e => setZoek(e.target.value)}
          placeholder="Zoek gemeente of provincie..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-sm text-white placeholder-white/40 focus:outline-none focus:border-magenta"
        />
      </div>
    </header>
  );
}
