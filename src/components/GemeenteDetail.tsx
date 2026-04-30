
import { X, Mail, Phone, ExternalLink } from 'lucide-react';
import type { GemeenteInfo } from '../types';
import { STATUS_COLOR, doelgroepLabels, doelgroepKleuren, subsidiePerPersoon } from '../types';

interface Props { g: GemeenteInfo; onClose: () => void }

function fmt(n: number) {
  if (n >= 1e9) return `\u20ac ${(n / 1e9).toFixed(1).replace('.', ',')} mld`;
  if (n >= 1e6) return `\u20ac ${Math.round(n / 1e6).toLocaleString('nl-NL')} mln`;
  return `\u20ac ${n.toLocaleString('nl-NL')}`;
}

export default function GemeenteDetail({ g, onClose }: Props) {
  const doelgroepen = Object.entries(g.doelgroepen) as [keyof typeof g.doelgroepen, { n: number; bereikbaarheid: number }][];
  const totalSubsidie = doelgroepen.reduce((sum, [key, val]) => sum + val.n * (subsidiePerPersoon[key] ?? 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mb-8" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-lijn">
          <div>
            <span className="eyebrow">Gemeente profiel</span>
            <h2 className="text-2xl font-semibold text-blauw mt-1">{g.naam}</h2>
            <p className="text-sm text-grijs">{g.provincie}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-bg-alt transition-colors"><X className="w-5 h-5 text-grijs" /></button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* SROI basis */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { l: 'SROI-percentage', v: `${g.sroi.pct}%` },
              { l: 'Status', v: <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLOR[g.sroi.status]}`}>{g.sroi.status}</span> },
              { l: 'Drempelwaarde', v: g.sroi.drempel ? fmt(g.sroi.drempel) : 'n.v.t.' },
              { l: 'Monitoring', v: g.sroi.monitoring ?? '—' },
            ].map(({ l, v }) => (
              <div key={l} className="bg-bg-alt rounded-xl p-3">
                <p className="text-xs text-grijs mb-1">{l}</p>
                <p className="font-semibold text-blauw text-sm">{v}</p>
              </div>
            ))}
          </div>

          {/* Uitvoerder */}
          {g.sroi.uitvoerder && (
            <div className="bg-bg-alt rounded-xl p-4">
              <p className="text-xs text-grijs mb-1">Uitvoerder</p>
              <p className="font-medium text-blauw text-sm">{g.sroi.uitvoerder}</p>
              {g.sroi.registratiesysteem && (
                <a href={`mailto:${g.sroi.registratiesysteem}`} className="text-xs text-magenta hover:underline flex items-center gap-1 mt-1">
                  <Mail className="w-3 h-3" />{g.sroi.registratiesysteem}
                </a>
              )}
            </div>
          )}

          {/* Arbeidsmarkt KPIs */}
          <div>
            <h3 className="text-sm font-semibold text-blauw mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-magenta rounded-full inline-block" />
              Arbeidsmarktpotentieel
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {doelgroepen.map(([key, val]) => (
                <div key={key} className="rounded-xl border border-lijn p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: doelgroepKleuren[key] }} />
                    <span className="text-xs text-grijs">{doelgroepLabels[key]}</span>
                  </div>
                  <p className="font-bold text-blauw">{val.n.toLocaleString('nl-NL')}</p>
                  <p className="text-xs text-grijs">Bereikbaarheid {val.bereikbaarheid}%</p>
                  <p className="text-xs text-magenta">{fmt(val.n * (subsidiePerPersoon[key] ?? 0))} subsidie</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-grijs mt-2">Totaal potentieel subsidie: <strong className="text-blauw">{fmt(totalSubsidie)}</strong></p>
          </div>

          {/* Bouwblokwaarden */}
          {g.bouwblokwaarden && g.bouwblokwaarden.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-blauw mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-magenta rounded-full inline-block" />
                SROI-waarden & bouwblokken
              </h3>
              <div className="divide-y divide-lijn rounded-xl border border-lijn overflow-hidden">
                {g.bouwblokwaarden.map((item, i) => (
                  <div key={i} className="flex justify-between items-center px-4 py-2.5 text-sm hover:bg-bg-alt transition-colors">
                    <span className="text-grijs">{item.label}</span>
                    <span className="font-semibold text-blauw whitespace-nowrap ml-4">{item.waarde}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contactpersonen */}
          {g.contactpersonen && g.contactpersonen.length > 0 && (
            <div className="bg-magenta-licht rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-blauw">Contactpersonen Social Return</p>
              {g.contactpersonen.map((cp, i) => (
                <div key={i} className="space-y-0.5">
                  <p className="text-sm font-medium text-blauw">{cp.naam}</p>
                  {cp.regio && <p className="text-xs text-grijs">{cp.regio}</p>}
                  <div className="flex flex-wrap gap-3 pt-0.5">
                    {cp.telefoon && (
                      <a href={`tel:${cp.telefoon}`} className="flex items-center gap-1.5 text-xs text-magenta hover:underline">
                        <Phone className="w-3 h-3" />{cp.telefoon}
                      </a>
                    )}
                    {cp.email && (
                      <a href={`mailto:${cp.email}`} className="flex items-center gap-1.5 text-xs text-magenta hover:underline">
                        <Mail className="w-3 h-3" />{cp.email}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Beleidsdocument */}
          {g.sroi.beleidsdocumentUrl && (
            <a href={g.sroi.beleidsdocumentUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-magenta hover:underline">
              <ExternalLink className="w-4 h-4" />Bekijk gemeentelijk SROI-beleid
            </a>
          )}

          {/* Instellingen */}
          {g.instellingen.length > 0 && (
            <div>
              <p className="text-xs text-grijs mb-2">Uitvoerende instellingen</p>
              <div className="flex flex-wrap gap-2">
                {g.instellingen.map((inst, i) => (
                  <span key={i} className="bg-bg-alt text-blauw text-xs px-3 py-1 rounded-full border border-lijn">{inst}</span>
                ))}
              </div>
            </div>
          )}

          {!g.isSeeded && (
            <p className="text-xs text-grijs italic bg-bg-alt rounded-xl p-3">
              Gedetailleerde SROI-beleidsinfo voor deze gemeente volgt. Data is afgeleid van CBS-gegevens.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
