import { useState, useRef } from 'react';
import { Printer, ChevronDown, ChevronUp, Info } from 'lucide-react';
import type { GemeenteInfo, BouwblokWaarde } from '../../types';

function parseEuroBedrag(waarde: string): number | null {
  const match = waarde.match(/€\s*([\d.,]+)/);
  if (!match) return null;
  const num = parseFloat(match[1].replace(/\./g, '').replace(',', '.'));
  return isNaN(num) ? null : num;
}

function fmt(n: number): string {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
}

function fmtAantal(n: number): string {
  return n.toLocaleString('nl-NL');
}

function groepeerBouwblokken(blokken: BouwblokWaarde[]): Record<string, BouwblokWaarde[]> {
  return blokken.reduce<Record<string, BouwblokWaarde[]>>((acc, b) => {
    const key = b.sectie ?? 'Overig';
    (acc[key] ??= []).push(b);
    return acc;
  }, {});
}

// Gemiddelde waarde per plaatsing: goedkoopste bouwblok, anders €35.000 als default
function gemiddeldeWaardePlaatsing(blokken: BouwblokWaarde[]): number {
  const bedragen = blokken
    .map(b => parseEuroBedrag(b.waarde))
    .filter((v): v is number => v !== null && v >= 5000);
  if (bedragen.length === 0) return 35000;
  return Math.min(...bedragen);
}

interface Props { g: GemeenteInfo }

export default function CalculatorTab({ g }: Props) {
  const [opdrachtwaarde, setOpdrachtwaarde] = useState('');
  const [openSectie, setOpenSectie] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const pct = g.sroi.pct ?? 5;
  const rawWaarde = parseFloat(opdrachtwaarde.replace(/\./g, '').replace(',', '.')) || 0;
  const sroiBedrag = rawWaarde * (pct / 100);
  const heeftResultaat = rawWaarde > 0;

  const drempel = g.sroi.drempel;
  const onderDrempel = drempel !== null && rawWaarde < drempel && rawWaarde > 0;

  const blokken = g.bouwblokwaarden ?? [];
  const groepen = groepeerBouwblokken(blokken);
  const waardePlaatsing = gemiddeldeWaardePlaatsing(blokken);
  const aantalPlaatsingen = sroiBedrag > 0 ? Math.ceil(sroiBedrag / waardePlaatsing) : null;

  // Totaal bereikbare mensen uit CBS-data
  const doelgroepen = Object.values(g.doelgroepen);
  const bereikbaar = doelgroepen.reduce((s, v) => s + Math.round(v.n * v.bereikbaarheid / 100), 0);

  return (
    <div className="flex flex-col">

      {/* ── CTA HERO ── */}
      <div className="px-4 pt-4 pb-5 border-b border-lijn">
        <h3 style={{ color: '#C2185B', fontSize: 17, fontWeight: 700, lineHeight: 1.25, marginBottom: '0.75rem' }}>
          Je hebt het werk.<br />Heb je ook de handjes?
        </h3>

        <div className="space-y-2">
          {/* Rij 1 — altijd zichtbaar */}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm text-grijs">{g.naam} heeft</span>
            <span className="text-xl font-bold text-blauw">{fmtAantal(bereikbaar)}</span>
            <span className="text-sm text-grijs">mensen klaarstaan voor Social Return.</span>
          </div>

          {/* Rij 2 — dynamisch zodra bedrag is ingevuld */}
          {heeftResultaat && !onderDrempel ? (
            <>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-sm text-grijs">Jouw SROI-verplichting bij</span>
                <span className="text-sm font-semibold text-blauw">{fmt(rawWaarde)}</span>
                <span className="text-sm text-grijs">is</span>
                <span className="text-xl font-bold" style={{ color: '#C2185B' }}>{fmt(sroiBedrag)}</span>
                <span className="text-sm text-grijs">.</span>
              </div>
              {aantalPlaatsingen !== null && (
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-sm text-grijs">Dat zijn</span>
                  <span className="text-xl font-bold text-blauw">{aantalPlaatsingen}</span>
                  <span className="text-sm text-grijs">plaatsing{aantalPlaatsingen !== 1 ? 'en' : ''}.</span>
                </div>
              )}
            </>
          ) : !heeftResultaat ? (
            <p className="text-xs text-grijs italic">Vul hieronder een opdrachtwaarde in om de verplichting te berekenen.</p>
          ) : null}

          {heeftResultaat && onderDrempel && (
            <div className="flex items-start gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-1">
              <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>Opdracht onder drempel van {fmt(drempel!)} — SROI mogelijk niet van toepassing.</span>
            </div>
          )}
        </div>
      </div>

      {/* ── CALCULATOR ── */}
      <div className="p-4 space-y-4">

        {/* Input */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-grijs uppercase tracking-wider">
            Opdrachtwaarde (excl. BTW)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-grijs text-sm font-medium">€</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="1.000.000"
              value={opdrachtwaarde}
              onChange={e => setOpdrachtwaarde(e.target.value.replace(/[^0-9.,]/g, ''))}
              className="w-full pl-7 pr-3 py-2.5 text-sm border border-lijn rounded-xl focus:outline-none focus:border-blauw bg-white"
            />
          </div>
          <div className="flex items-center gap-2 bg-bg-alt rounded-xl px-3 py-2">
            <span className="text-xs text-grijs">Gemeente</span>
            <span className="text-xs font-semibold text-blauw">{g.naam}</span>
            <span className="ml-auto text-xs text-grijs">SROI</span>
            <span className="text-xs font-bold text-blauw">{pct}%</span>
          </div>
        </div>

        {/* Bouwblokken */}
        {heeftResultaat && !onderDrempel && (
          <div ref={printRef} className="space-y-3">
            <div className="bg-blauw rounded-xl p-4 text-white">
              <p className="text-xs opacity-70 uppercase tracking-wider mb-1">SROI-verplichting</p>
              <p className="text-3xl font-bold">{fmt(sroiBedrag)}</p>
              <p className="text-xs opacity-70 mt-1">{fmt(rawWaarde)} × {pct}% = {fmt(sroiBedrag)}</p>
            </div>

            {blokken.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-grijs uppercase tracking-wider">Invulling per bouwblok</p>
                {Object.entries(groepen).map(([sectie, items]) => {
                  const isOpen = openSectie === sectie;
                  return (
                    <div key={sectie} className="border border-lijn rounded-xl overflow-hidden">
                      <button
                        onClick={() => setOpenSectie(isOpen ? null : sectie)}
                        className="w-full flex items-center justify-between px-3 py-2.5 bg-bg-alt hover:bg-blauw/5 transition-colors"
                      >
                        <span className="text-xs font-semibold text-blauw">{sectie}</span>
                        {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-grijs" /> : <ChevronDown className="w-3.5 h-3.5 text-grijs" />}
                      </button>
                      {isOpen && (
                        <div className="divide-y divide-lijn">
                          {items.map((b, i) => {
                            const bedragPerPlaatsing = parseEuroBedrag(b.waarde);
                            const aantalNodig = bedragPerPlaatsing && bedragPerPlaatsing > 0
                              ? Math.ceil(sroiBedrag / bedragPerPlaatsing)
                              : null;
                            return (
                              <div key={i} className="px-3 py-2.5 bg-white">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <p className="text-xs font-medium text-blauw leading-snug">{b.label}</p>
                                    <p className="text-xs text-grijs mt-0.5">{b.waarde}</p>
                                  </div>
                                  {aantalNodig !== null && (
                                    <div className="flex-shrink-0 text-right">
                                      <p className="text-lg font-bold text-blauw leading-none">{aantalNodig}</p>
                                      <p className="text-xs text-grijs">plaatsing{aantalNodig !== 1 ? 'en' : ''}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-bg-alt rounded-xl p-3">
                <p className="text-xs text-grijs">Geen bouwblokdata beschikbaar. Neem contact op met {g.naam} voor de invullingsmogelijkheden.</p>
              </div>
            )}

            <button
              onClick={() => window.print()}
              className="w-full flex items-center justify-center gap-2 border border-lijn rounded-xl py-2.5 text-xs font-medium text-blauw hover:bg-blauw/5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Afdrukken / opslaan als PDF
            </button>
          </div>
        )}

        <div className="text-xs text-grijs border-t border-lijn pt-3">
          Berekening op basis van {pct}% SROI-eis gemeente {g.naam}. Aantal plaatsingen is indicatief.
        </div>
      </div>
    </div>
  );
}
