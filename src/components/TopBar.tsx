
import { Search } from 'lucide-react';

interface Props {
  zoek: string;
  setZoek: (v: string) => void;
  totaal: number;
  actief: number;
}

export default function TopBar({ zoek, setZoek, totaal, actief }: Props) {
  return (
    <header className="bg-white border-b border-lijn px-5 py-3 flex flex-col md:flex-row md:items-center gap-3">
      <div className="flex-1">
        <div className="flex items-baseline gap-3">
          <h1 className="text-lg font-bold text-blauw">SROI Monitor Nederland</h1>
          <span className="text-grijs text-sm hidden md:inline">Inzicht in sociale waarde per gemeente</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-sm text-grijs">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
          {actief} gemeenten actief
        </span>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grijs" />
          <input
            value={zoek}
            onChange={e => setZoek(e.target.value)}
            placeholder={`Zoek gemeente... (${totaal})`}
            className="pl-9 pr-4 py-2 rounded-xl border border-lijn text-sm text-blauw focus:outline-none focus:border-magenta w-56"
          />
        </div>
      </div>
    </header>
  );
}
