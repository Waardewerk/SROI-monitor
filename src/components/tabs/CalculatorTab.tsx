import { useState, useRef } from 'react';
import { Calculator, Printer, ChevronDown, ChevronUp, Info } from 'lucide-react';
import type { GemeenteInfo, BouwblokWaarde } from '../../types';

// Parst eerste euro-bedrag uit een waarde-string zoals "€ 40.000 (jaarcontract)"
function parseEuroBedrag(waarde: string): number | null {
  const match = waarde.match(/€\s*([\d.,]+)/);
  if (!match) return null;
  const num = parseFloat(match[1].replace(/\./g, '').replace(',', '.'));
  return isNaN(num) ? null : num;
}

function fmt(n: number): string {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
}

function groepeerBouwblokken(blokken: BouwblokWaarde[]): Record<string, BouwblokWaarde[]> {
  return blokken.reduce<Record<string, BouwblokWaarde[]>>((acc, b) => {
    const key = b.sectie ?? 'Overig';
    (acc[key] ??= []).push(b);
    return acc;
  }, {});
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

  function handlePrint() {
    window.print();
  }

  return (
    <div className="p-4 space-y-4">

      {/* Input */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-grijs uppercase tracking-wider mb-1">
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
        </div>

        <div className="flex items-center gap-2 bg-bg-alt rounded-xl px-3 py-2">
          <span className="text-xs text-grijs">Gemeente</span>
          <span className="text-xs font-semibold text-blauw">{g.naam}</span>
          <span className="ml-auto text-xs text-grijs">SROI</span>
          <span className="text-xs font-bold text-blauw">{pct}%</span>
        </div>
      </div>

      {/* Resultaat */}
      {heeftResultaat && (
        <div ref={printRef} className="space-y-3 print-area">

          {onderDrempel && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
              <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                Opdrachtwaarde ligt onder de drempelwaarde van {fmt(drempel!)}. SROI is mogelijk niet van toepassing, check het beleid van {g.naam}.
              </p>
            </div>
          )}

          {/* Hoofdbedrag */}
          <div className="bg-blauw rounded-xl p-4 text-white">
            <p className="text-xs opacity-70 uppercase tracking-wider mb-1">SROI-verplichting</p>
            <p className="text-3xl font-bold">{fmt(sroiBedrag)}</p>
            <p className="text-xs opacity-70 mt-1">
              {fmt(rawWaarde)} × {pct}% = {fmt(sroiBedrag)}
            </p>
          </div>

          {/* Bouwblokken */}
          {blokken.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-grijs uppercase tracking-wider">
                Invulling per bouwblok
              </p>
              {Object.entries(groepen).map(([sectie, items]) => {
                const isOpen = openSectie === sectie;
                return (
                  <div key={sectie} className="border border-lijn rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenSectie(isOpen ? null : sectie)}
                      className="w-full flex items-center justify-between px-3 py-2.5 bg-bg-alt hover:bg-blauw/5 transition-colors"
                    >
                      <span className="text-xs font-semibold text-blauw">{sectie}</span>
                      {isOpen
                        ? <ChevronUp className="w-3.5 h-3.5 text-grijs" />
                        : <ChevronDown className="w-3.5 h-3.5 text-grijs" />
                      }
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
              <p className="text-xs text-grijs">
                Geen bouwblokdata beschikbaar voor {g.naam}. Neem contact op met de gemeente voor de exacte invullingsmogelijkheden.
              </p>
            </div>
          )}

          {/* Print */}
          <button
            onClick={handlePrint}
            className="w-full flex items-center justify-center gap-2 border border-lijn rounded-xl py-2.5 text-xs font-medium text-blauw hover:bg-blauw/5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Afdrukken / opslaan als PDF
          </button>
        </div>
      )}

      {!heeftResultaat && (
        <div className="flex flex-col items-center justify-center py-8 text-center text-grijs space-y-2">
          <Calculator className="w-8 h-8 opacity-30" />
          <p className="text-xs">Vul een opdrachtwaarde in om de SROI-verplichting te berekenen.</p>
        </div>
      )}

      <div className="text-xs text-grijs border-t border-lijn pt-3">
        Berekening op basis van {pct}% SROI-eis gemeente {g.naam}. Aantal plaatsingen is indicatief op basis van de eerste waarde per bouwblok.
      </div>
    </div>
  );
}
