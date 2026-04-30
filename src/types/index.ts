
export type SROIStatus = 'Verplicht' | 'Actief' | 'Actief beleid' | 'In ontwikkeling';

export interface BouwblokWaarde {
  label: string;
  waarde: string;
  sectie?: string;   // bijv. 'Banen', 'Bonussen', 'Maatwerk'
}

export interface ContactPersoon {
  naam: string;
  telefoon?: string;
  email?: string;
  regio?: string;
}

export interface Succesverhaal {
  titel: string;
  tekst: string;
}

export interface DoelgroepInfo {
  n: number;
  bereikbaarheid: number;
}

export interface GemeenteInfo {
  naam: string;
  gmCode: string;
  provincie?: string;
  werkloosheid?: number;
  bijstand: number;
  buigBudget: number;
  reintegratiebudget: number;
  sroi: {
    pct: number;
    status: SROIStatus;
    drempel: number | null;
    aanbestedingsvolume?: number;
    monitoring?: string;
    beleidsdocumentUrl?: string;
    uitvoerder?: string;
    registratiesysteem?: string;
    methode?: string;
  };
  doelgroepen: {
    bijstand: DoelgroepInfo;
    nuggers: DoelgroepInfo;
    statushouders: DoelgroepInfo;
    vsv: DoelgroepInfo;
    arbeidsbeperkt: DoelgroepInfo;
    ouderen55plus: DoelgroepInfo;
  };
  instellingen: string[];
  contactpersonen?: ContactPersoon[];
  bouwblokwaarden?: BouwblokWaarde[];
  erkendepartners?: string[];
  succesverhalen?: Succesverhaal[];
  isSeeded: boolean;
}

export const STATUS_COLOR: Record<SROIStatus, string> = {
  'Verplicht': 'bg-green-100 text-green-700',
  'Actief': 'bg-blue-100 text-blue-700',
  'Actief beleid': 'bg-blue-100 text-blue-700',
  'In ontwikkeling': 'bg-yellow-100 text-yellow-700',
};

export const doelgroepLabels = {
  bijstand:       'Bijstandsgerechtigd',
  nuggers:        'NUG',
  statushouders:  'Statushouder',
  vsv:            'VSV (18-27)',
  arbeidsbeperkt: 'Arbeidsbeperkt',
  ouderen55plus:  '55+',
} as const;

export const doelgroepKleuren: Record<string, string> = {
  bijstand:       '#C2185B',
  nuggers:        '#1565C0',
  statushouders:  '#6A1B9A',
  vsv:            '#E65100',
  arbeidsbeperkt: '#00695C',
  ouderen55plus:  '#AD1457',
};

export const subsidiePerPersoon = {
  bijstand:       18000,
  nuggers:         3000,
  statushouders:  10000,
  vsv:             2500,
  arbeidsbeperkt: 28000,
  ouderen55plus:   4000,
} as const;

export function deriveGemeenteInfo(gmCode: string, naam: string, bijstand: number, werkloosheid?: number): GemeenteInfo {
  const b = Math.max(bijstand, 0);
  return {
    naam, gmCode, werkloosheid,
    bijstand: b,
    buigBudget: b * 18000,
    reintegratiebudget: Math.round(b * 18000 * 0.09),
    sroi: { pct: 5, status: 'In ontwikkeling', drempel: 250000 },
    doelgroepen: {
      bijstand:       { n: b,                        bereikbaarheid: 50 },
      nuggers:        { n: Math.round(b * 0.35),     bereikbaarheid: 40 },
      statushouders:  { n: Math.round(b * 0.12),     bereikbaarheid: 35 },
      vsv:            { n: Math.round(b * 0.08),     bereikbaarheid: 25 },
      arbeidsbeperkt: { n: Math.round(b * 0.20),     bereikbaarheid: 45 },
      ouderen55plus:  { n: Math.round(b * 0.15),     bereikbaarheid: 30 },
    },
    instellingen: [],
    isSeeded: false,
  };
}
