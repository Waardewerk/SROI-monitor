
import { useState } from 'react';
import { X, Phone } from 'lucide-react';
import type { GemeenteInfo } from '../types';
import { STATUS_COLOR } from '../types';
import DoelgroepenTab from './tabs/DoelgroepenTab';
import SROIRegelsTab from './tabs/SROIRegelsTab';
import SubsidieTab from './tabs/SubsidieTab';
import SuccessenTab from './tabs/SuccessenTab';

type Tab = 'doelgroepen' | 'sroi' | 'subsidie' | 'netwerk';

interface Props {
  g: GemeenteInfo;
  onClose: () => void;
}

export default function Sidebar({ g, onClose }: Props) {
  const [tab, setTab] = useState<Tab>('doelgroepen');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'doelgroepen', label: 'Doelgroepen' },
    { id: 'sroi',        label: 'SROI-regels' },
    { id: 'subsidie',    label: 'Subsidie' },
    { id: 'netwerk',     label: 'Netwerk' },
  ];

  const drempelLabel = g.sroi.drempel
    ? `€${(g.sroi.drempel / 1000).toFixed(0)}k`
    : 'n.v.t.';

  return (
    <div className="flex flex-col h-full bg-white border-l border-lijn overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between px-4 pt-4 pb-3 border-b border-lijn flex-shrink-0">
        <div className="min-w-0 pr-2">
          <p className="text-xs text-grijs uppercase tracking-wider font-medium">Gemeente profiel</p>
          <h2 className="text-lg font-bold text-blauw leading-tight mt-0.5 truncate">{g.naam}</h2>
          <div className="flex items-center gap-2 mt-1">
            {g.provincie && <span className="text-xs text-grijs">{g.provincie}</span>}
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLOR[g.sroi.status]}`}>{g.sroi.status}</span>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-bg-alt transition-colors flex-shrink-0">
          <X className="w-4 h-4 text-grijs" />
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 border-b border-lijn flex-shrink-0">
        <div className="px-3 py-2 border-r border-lijn text-center">
          <p className="text-base font-bold text-blauw">{g.sroi.pct}%</p>
          <p className="text-xs text-grijs">SROI</p>
        </div>
        <div className="px-3 py-2 border-r border-lijn text-center">
          <p className="text-base font-bold text-blauw">{g.bijstand.toLocaleString('nl-NL')}</p>
          <p className="text-xs text-grijs">bijstand</p>
        </div>
        <div className="px-3 py-2 text-center">
          <p className="text-base font-bold text-blauw">{drempelLabel}</p>
          <p className="text-xs text-grijs">drempel</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-lijn flex-shrink-0 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
              tab === t.id
                ? 'border-magenta text-magenta'
                : 'border-transparent text-grijs hover:text-blauw'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content — scrollable */}
      <div className="flex-1 overflow-y-auto">
        {tab === 'doelgroepen' && <DoelgroepenTab g={g} />}
        {tab === 'sroi'        && <SROIRegelsTab  g={g} />}
        {tab === 'subsidie'    && <SubsidieTab    g={g} />}
        {tab === 'netwerk'     && <SuccessenTab   g={g} />}
      </div>

      {/* Bottom CTA */}
      <div className="flex-shrink-0 border-t border-lijn p-4 bg-bg-alt">
        <p className="text-xs font-semibold text-blauw mb-1">Hulp nodig bij SROI in {g.naam}?</p>
        <p className="text-xs text-grijs mb-3">Waardewerk helpt aannemers en gemeenten met social return implementatie.</p>
        <a href="tel:+31850601800"
          className="flex items-center justify-center gap-2 w-full bg-magenta text-white text-sm font-medium py-2.5 rounded-xl hover:bg-magenta/90 transition-colors">
          <Phone className="w-4 h-4" />
          Bel ons: 085 060 1800
        </a>
      </div>
    </div>
  );
}
