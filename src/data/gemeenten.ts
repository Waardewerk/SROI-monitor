
import type { GemeenteInfo } from '../types';

export const seededGemeenten: GemeenteInfo[] = [
  // ── Grote steden ──
  {
    naam: 'Rotterdam', gmCode: 'GM0599', provincie: 'Zuid-Holland',
    werkloosheid: 9.1, bijstand: 28400, buigBudget: 485000000, reintegratiebudget: 42000000,
    sroi: { pct: 5, status: 'Verplicht', drempel: 250000, aanbestedingsvolume: 2400000000, monitoring: 'Kwartaal', beleidsdocumentUrl: 'https://www.rotterdam.nl/werken-leren/sroi/' },
    doelgroepen: { bijstand: { n: 28400, bereikbaarheid: 88 }, nuggers: { n: 9200, bereikbaarheid: 62 }, statushouders: { n: 4100, bereikbaarheid: 45 }, vsv: { n: 1850, bereikbaarheid: 30 }, arbeidsbeperkt: { n: 6300, bereikbaarheid: 55 }, ouderen55plus: { n: 3700, bereikbaarheid: 38 } },
    instellingen: ['WSP Rijnmond', 'Stichting Mens en Verkeer', 'Stroomopwaarts MVS'], isSeeded: true,
  },
  {
    naam: 'Amsterdam', gmCode: 'GM0363', provincie: 'Noord-Holland',
    werkloosheid: 6.8, bijstand: 31200, buigBudget: 538000000, reintegratiebudget: 58000000,
    sroi: { pct: 5, status: 'Verplicht', drempel: 250000, aanbestedingsvolume: 3100000000, monitoring: 'Kwartaal', beleidsdocumentUrl: 'https://www.amsterdam.nl/werk-inkomen/sroi/' },
    doelgroepen: { bijstand: { n: 31200, bereikbaarheid: 90 }, nuggers: { n: 11000, bereikbaarheid: 65 }, statushouders: { n: 5800, bereikbaarheid: 52 }, vsv: { n: 2400, bereikbaarheid: 35 }, arbeidsbeperkt: { n: 7100, bereikbaarheid: 58 }, ouderen55plus: { n: 4200, bereikbaarheid: 42 } },
    instellingen: ['Amsterdam Werkt', 'UWV Amsterdam', 'Pantar'], isSeeded: true,
  },

  // ── Utrecht ──
  {
    naam: 'Utrecht', gmCode: 'GM0344', provincie: 'Utrecht',
    werkloosheid: 4.2, bijstand: 9800, buigBudget: 162000000, reintegratiebudget: 18000000,
    sroi: {
      pct: 5, status: 'Verplicht', drempel: 250000, aanbestedingsvolume: 890000000,
      monitoring: 'Jaarlijks', methode: 'Bouwblokken',
      beleidsdocumentUrl: 'https://www.utrecht.nl/werk-en-inkomen/sroi/',
      uitvoerder: 'Werk & Inkomen Utrecht',
      registratiesysteem: 'socialreturn@utrecht.nl',
    },
    doelgroepen: { bijstand: { n: 9800, bereikbaarheid: 55 }, nuggers: { n: 3100, bereikbaarheid: 38 }, statushouders: { n: 1900, bereikbaarheid: 35 }, vsv: { n: 780, bereikbaarheid: 20 }, arbeidsbeperkt: { n: 2900, bereikbaarheid: 44 }, ouderen55plus: { n: 1600, bereikbaarheid: 28 } },
    instellingen: ['Werk & Inkomen Utrecht', 'WSP Midden-Utrecht', 'Ferm Werk'],
    bouwblokwaarden: [
      // Banen & leerwerkplekken (jaarcontract 36 uur)
      { sectie: 'Banen & leerwerkplekken', label: 'Participatiewet', waarde: '€ 40.000/jaar' },
      { sectie: 'Banen & leerwerkplekken', label: 'Doelgroepregister UWV (arbeidsbeperking)', waarde: '€ 50.000/jaar' },
      { sectie: 'Banen & leerwerkplekken', label: 'Leerwerkplek VSO / mbo niveau 1', waarde: '€ 35.000/jaar' },
      { sectie: 'Banen & leerwerkplekken', label: 'WIA- of WAO-uitkering UWV', waarde: '€ 40.000/jaar' },
      { sectie: 'Banen & leerwerkplekken', label: 'WW-uitkering UWV', waarde: '€ 20.000/jaar' },
      { sectie: 'Banen & leerwerkplekken', label: 'Mbo BBL niveau 2, 3 en 4', waarde: '€ 35.000/jaar' },
      { sectie: 'Banen & leerwerkplekken', label: 'Mbo BOL niveau 2, 3 en 4', waarde: '€ 20.000/jaar' },
      { sectie: 'Banen & leerwerkplekken', label: 'Geen recht op uitkering (NUG)', waarde: '€ 10.000/jaar' },
      // Bonussen
      { sectie: 'Bonussen', label: 'Ouder dan 50 jaar', waarde: '+ € 10.000' },
      { sectie: 'Bonussen', label: 'Statushouder / taalachterstand', waarde: '+ € 10.000' },
      { sectie: 'Bonussen', label: 'Vast contract', waarde: '+ € 10.000' },
      // Andere invulling
      { sectie: 'Andere invulling', label: 'Inkopen bij sociale bedrijven', waarde: 'Loonkosten excl. btw' },
      { sectie: 'Andere invulling', label: 'Scholing, kennis of middelen', waarde: 'Kosten of € 100/uur per medewerker' },
      { sectie: 'Andere invulling', label: 'Sociaal project steunen', waarde: 'Kosten of € 100/uur per medewerker' },
      { sectie: 'Andere invulling', label: 'Scholing & ontwikkeling SR-medewerkers', waarde: 'In overleg met adviseur' },
      { sectie: 'Andere invulling', label: 'Werkzoekenden richting werk ondersteunen', waarde: 'In overleg met adviseur' },
    ],
    isSeeded: true,
  },

  // ── Groningen ──
  {
    naam: 'Groningen', gmCode: 'GM0014', provincie: 'Groningen',
    werkloosheid: 7.3, bijstand: 11400, buigBudget: 196000000, reintegratiebudget: 22000000,
    sroi: {
      pct: 5, status: 'Verplicht', drempel: 250000, aanbestedingsvolume: 560000000,
      monitoring: 'Kwartaal', methode: 'Bouwblokken (SR 3.0 – 2025)',
      uitvoerder: 'Coördinatiepunt Social Return Groningen / Werk in Zicht',
      registratiesysteem: 'SocialReturn@werkinzicht.nl',
    },
    doelgroepen: { bijstand: { n: 11400, bereikbaarheid: 72 }, nuggers: { n: 3800, bereikbaarheid: 55 }, statushouders: { n: 2200, bereikbaarheid: 40 }, vsv: { n: 1100, bereikbaarheid: 38 }, arbeidsbeperkt: { n: 3100, bereikbaarheid: 60 }, ouderen55plus: { n: 2600, bereikbaarheid: 52 } },
    instellingen: ['Coördinatiepunt SR / Werk in Zicht', 'UWV Groningen', 'Ability'],
    bouwblokwaarden: [
      { sectie: 'Maatwerk-activiteiten', label: 'Werkervaringsplaats', waarde: '€ 75/uur, max 10 uur/week, max 3 mnd' },
      { sectie: 'Maatwerk-activiteiten', label: 'Taalstage', waarde: '€ 75/uur, max 10 uur/week, max 3 mnd' },
      { sectie: 'Maatwerk-activiteiten', label: 'Praktijkleren mbo-Praktijkverklaring', waarde: '€ 17.500/jaar naar rato' },
      { sectie: 'Maatwerk-activiteiten', label: 'Jobcoaching', waarde: '€ 25/uur, max 10 uur/week' },
      { sectie: 'Maatwerk-activiteiten', label: 'Gastcollege, rondleiding, kennisdeling', waarde: '€ 100/uur, max 10 uur incl. voorbereiding' },
      { sectie: 'Maatwerk-activiteiten', label: 'Deelname evenement werk & ontwikkeling regio', waarde: '€ 1.250 per dagdeel per persoon' },
      { sectie: 'Maatwerk-activiteiten', label: 'Scholing medewerkers met taalachterstand', waarde: '€ 10.000 eenmalig' },
      { sectie: 'Maatwerk-activiteiten', label: 'Taal Werkt! training', waarde: 'tot € 1.000 als maatwerk' },
      { sectie: 'Sociale ondernemingen', label: 'Inkopen bij sociale ondernemingen', waarde: 'Arbeidskosten meetelbaar; materiaalkosten in overleg' },
      { sectie: 'Sociale ondernemingen', label: 'Lunch, bloemen, vergaderzaal bij soc. onderneming', waarde: 'Volledige factuur telt mee' },
      { sectie: 'Overig (in overleg)', label: 'Co-financiering re-integratieproject', waarde: 'In overleg met opdrachtgever' },
      { sectie: 'Overig (in overleg)', label: 'Duurzame inzetbaarheid medewerkers', waarde: 'In overleg met accountmanager' },
      { sectie: 'Overig (in overleg)', label: 'Bijdrage maatschappelijke initiatieven', waarde: 'In overleg, na goedkeuring Coördinatiepunt SR' },
    ],
    erkendepartners: [
      'Jeugd Educatie Fonds',
      'Kijk dat werkt (Techniek voor de Klas)',
      'Everyday Heroes',
      'Stichting Present',
      'Stichting Klushulp Groningen',
      'JINC',
      'Vanhulley / Zowerkthet! (€ 100/uur)',
    ],
    succesverhalen: [
      {
        titel: 'Vanberkel Foundation — Sociaal Jaarverslag 2025',
        tekst: 'Vanuit de Vanberkel Foundation is team SROI het hele jaar door bezig met sociaal-maatschappelijke partnerschappen en activiteiten. Op pagina 22 van hun Sociaal Jaarverslag 2025 wordt beschreven hoe Vanberkel invulling heeft gegeven aan Social Return binnen het programma BMB Duurzaam Herstel Groningen voor opdrachtgever Instituut Mijnbouwschade Groningen (IMG).',
      },
      {
        titel: 'Vanhulley – Zowerkthet!',
        tekst: 'Vanhulley is een sociale onderneming die vrouwen met een afstand tot de arbeidsmarkt een netwerk biedt voor hun loopbaan. Deelname aan het Zowerkthet! programma wordt gewaardeerd op € 100 per uur voor de uren dat een Vanhulley-vrouw bij het bedrijf op bezoek komt.',
      },
    ],
    isSeeded: true,
  },

  {
    naam: 'Eindhoven', gmCode: 'GM0772', provincie: 'Noord-Brabant',
    werkloosheid: 5.4, bijstand: 9200, buigBudget: 158000000, reintegratiebudget: 16000000,
    sroi: { pct: 5, status: 'Verplicht', drempel: 250000, aanbestedingsvolume: 680000000, monitoring: 'Jaarlijks' },
    doelgroepen: { bijstand: { n: 9200, bereikbaarheid: 60 }, nuggers: { n: 3000, bereikbaarheid: 40 }, statushouders: { n: 1500, bereikbaarheid: 32 }, vsv: { n: 850, bereikbaarheid: 25 }, arbeidsbeperkt: { n: 2400, bereikbaarheid: 42 }, ouderen55plus: { n: 1800, bereikbaarheid: 35 } },
    instellingen: ['WSP Zuidoost-Brabant', 'IW4', 'UWV Eindhoven'], isSeeded: true,
  },
  {
    naam: "'s-Hertogenbosch", gmCode: 'GM0796', provincie: 'Noord-Brabant',
    werkloosheid: 4.7, bijstand: 6100, buigBudget: 98000000, reintegratiebudget: 11000000,
    sroi: { pct: 5, status: 'Actief beleid', drempel: 250000, aanbestedingsvolume: 410000000, monitoring: 'Jaarlijks' },
    doelgroepen: { bijstand: { n: 6100, bereikbaarheid: 50 }, nuggers: { n: 2000, bereikbaarheid: 35 }, statushouders: { n: 820, bereikbaarheid: 28 }, vsv: { n: 410, bereikbaarheid: 18 }, arbeidsbeperkt: { n: 1800, bereikbaarheid: 40 }, ouderen55plus: { n: 1100, bereikbaarheid: 30 } },
    instellingen: ['Baanbrekers', 'WSP Midden-Brabant', 'UWV Den Bosch'], isSeeded: true,
  },

  // ── ESR / WIZZR regio ──
  {
    naam: 'Apeldoorn', gmCode: 'GM0200', provincie: 'Gelderland',
    werkloosheid: 5.0, bijstand: 3670, buigBudget: 66000000, reintegratiebudget: 6000000,
    sroi: { pct: 5, status: 'Verplicht', drempel: 250000, monitoring: 'Kwartaal', uitvoerder: 'Expertisecentrum Social Return (ESR)', registratiesysteem: 'WIZZR' },
    doelgroepen: { bijstand: { n: 3670, bereikbaarheid: 60 }, nuggers: { n: 1280, bereikbaarheid: 42 }, statushouders: { n: 440, bereikbaarheid: 35 }, vsv: { n: 290, bereikbaarheid: 22 }, arbeidsbeperkt: { n: 734, bereikbaarheid: 45 }, ouderen55plus: { n: 550, bereikbaarheid: 30 } },
    instellingen: ['Expertisecentrum Social Return (ESR)'],
    contactpersonen: [{ naam: 'Robyn Bruggeman', telefoon: '06-81926136', regio: 'Apeldoorn' }],
    bouwblokwaarden: [
      { label: 'Participatiewet < 2 jaar', waarde: '€ 30.000/jaar' },
      { label: 'Participatiewet > 2 jaar', waarde: '€ 40.000/jaar' },
      { label: 'NUGGER', waarde: '€ 10.000/jaar' },
      { label: 'WW < 1 jaar', waarde: '€ 10.000/jaar' },
      { label: 'WW > 1 jaar', waarde: '€ 15.000/jaar' },
      { label: 'Werkervaringsplek', waarde: '€ 750/maand' },
      { label: 'BBL niveau 1-2', waarde: '€ 20.000/leerwerkjaar' },
      { label: 'BBL niveau 3-4', waarde: '€ 15.000/leerwerkjaar' },
    ],
    isSeeded: true,
  },
  {
    naam: 'Deventer', gmCode: 'GM0150', provincie: 'Overijssel',
    werkloosheid: 5.8, bijstand: 2990, buigBudget: 53820000, reintegratiebudget: 4844000,
    sroi: { pct: 5, status: 'Verplicht', drempel: 250000, monitoring: 'Kwartaal', uitvoerder: 'Expertisecentrum Social Return (ESR)', registratiesysteem: 'WIZZR' },
    doelgroepen: { bijstand: { n: 2990, bereikbaarheid: 60 }, nuggers: { n: 1047, bereikbaarheid: 42 }, statushouders: { n: 359, bereikbaarheid: 35 }, vsv: { n: 239, bereikbaarheid: 22 }, arbeidsbeperkt: { n: 598, bereikbaarheid: 45 }, ouderen55plus: { n: 449, bereikbaarheid: 30 } },
    instellingen: ['Expertisecentrum Social Return (ESR)'],
    contactpersonen: [{ naam: 'Maarten Waalkens', telefoon: '06-31276815', regio: 'Deventer / Voorst' }],
    bouwblokwaarden: [
      { label: 'Participatiewet < 2 jaar', waarde: '€ 30.000/jaar' }, { label: 'Participatiewet > 2 jaar', waarde: '€ 40.000/jaar' },
      { label: 'NUGGER', waarde: '€ 10.000/jaar' }, { label: 'WW < 1 jaar', waarde: '€ 10.000/jaar' }, { label: 'WW > 1 jaar', waarde: '€ 15.000/jaar' },
      { label: 'Werkervaringsplek', waarde: '€ 750/maand' }, { label: 'BBL niveau 1-2', waarde: '€ 20.000/leerwerkjaar' }, { label: 'BBL niveau 3-4', waarde: '€ 15.000/leerwerkjaar' },
    ],
    isSeeded: true,
  },
  {
    naam: 'Zutphen', gmCode: 'GM0301', provincie: 'Gelderland',
    werkloosheid: 6.2, bijstand: 1570, buigBudget: 28260000, reintegratiebudget: 2543000,
    sroi: { pct: 5, status: 'Verplicht', drempel: 250000, monitoring: 'Kwartaal', uitvoerder: 'Expertisecentrum Social Return (ESR)', registratiesysteem: 'WIZZR' },
    doelgroepen: { bijstand: { n: 1570, bereikbaarheid: 62 }, nuggers: { n: 550, bereikbaarheid: 44 }, statushouders: { n: 188, bereikbaarheid: 36 }, vsv: { n: 126, bereikbaarheid: 23 }, arbeidsbeperkt: { n: 314, bereikbaarheid: 46 }, ouderen55plus: { n: 236, bereikbaarheid: 32 } },
    instellingen: ['Expertisecentrum Social Return (ESR)'],
    contactpersonen: [{ naam: 'Sanne Schaap', telefoon: '06-51984364', regio: 'Zutphen / Lochem / Brummen' }],
    bouwblokwaarden: [
      { label: 'Participatiewet < 2 jaar', waarde: '€ 30.000/jaar' }, { label: 'Participatiewet > 2 jaar', waarde: '€ 40.000/jaar' },
      { label: 'NUGGER', waarde: '€ 10.000/jaar' }, { label: 'WW < 1 jaar', waarde: '€ 10.000/jaar' }, { label: 'WW > 1 jaar', waarde: '€ 15.000/jaar' },
      { label: 'Werkervaringsplek', waarde: '€ 750/maand' }, { label: 'BBL niveau 1-2', waarde: '€ 20.000/leerwerkjaar' }, { label: 'BBL niveau 3-4', waarde: '€ 15.000/leerwerkjaar' },
    ],
    isSeeded: true,
  },

  // ── Stroomopwaarts MVS ──
  {
    naam: 'Maassluis', gmCode: 'GM0556', provincie: 'Zuid-Holland',
    werkloosheid: 5.2, bijstand: 950, buigBudget: 17100000, reintegratiebudget: 1539000,
    sroi: { pct: 5, status: 'Actief', drempel: null, monitoring: 'Kwartaal', methode: 'Bouwblokken (impactwaardering)', uitvoerder: 'Stroomopwaarts MVS', registratiesysteem: 'sroi@stroomopwaarts.nl' },
    doelgroepen: { bijstand: { n: 950, bereikbaarheid: 60 }, nuggers: { n: 333, bereikbaarheid: 42 }, statushouders: { n: 114, bereikbaarheid: 35 }, vsv: { n: 76, bereikbaarheid: 22 }, arbeidsbeperkt: { n: 190, bereikbaarheid: 43 }, ouderen55plus: { n: 143, bereikbaarheid: 28 } },
    instellingen: ['Stroomopwaarts MVS', 'WSPR Rijnmond'],
    bouwblokwaarden: [
      // Werken — impactwaardering (niet gekoppeld aan loonkosten)
      { sectie: 'Werken', label: 'Participatiewet', waarde: '€ 24,04/uur | € 50.000/jaar (max 3 jr na uitkering)' },
      { sectie: 'Werken', label: 'Banenafspraak / Doelgroepregister / WIA / WAO', waarde: '€ 24,04/uur | € 50.000/jaar (altijd opvoerbaar)' },
      { sectie: 'Werken', label: 'WW-uitkering', waarde: '€ 12,02/uur | € 25.000/jaar (max 2 jr na uitkering)' },
      { sectie: 'Werken', label: 'NUG (Niet-Uitkeringsgerechtigde)', waarde: '€ 7,21/uur | € 15.000/jaar (max 2 jaar)' },
      { sectie: 'Bonussen', label: 'Bonus vast contract (onbepaalde tijd)', waarde: '1× jaarwaardering doelgroep' },
      { sectie: 'Bonussen', label: 'Bonus 56+ in dienst nemen', waarde: '€ 2,40/uur extra | € 5.000/jaar' },
      // Leren
      { sectie: 'Leren', label: 'Leerling BBL (mbo niveau 1–4)', waarde: '€ 7,21/uur | € 15.000/jaar' },
      { sectie: 'Leren', label: 'Leerling VSO / praktijkonderwijs', waarde: '€ 7,21/uur | € 15.000/jaar' },
      { sectie: 'Leren', label: 'Stagiaire / leerling BOL', waarde: '€ 3,60/uur | € 7.500/jaar' },
      { sectie: 'Leren', label: 'Vakinhoudelijke training / coaching', waarde: 'Gefactureerde kosten excl. btw' },
      { sectie: 'Leren', label: 'Taaltraining (bonus)', waarde: 'Gefactureerde kosten + 100% bonus tot € 2.000' },
      // Overig
      { sectie: 'Sociaal inkopen', label: 'Inkopen bij erkend sociaal ondernemer (WSP Rijnmond)', waarde: 'Volledig factuurbedrag excl. btw' },
      { sectie: 'Maatschappelijke activiteiten', label: 'Gastles over bedrijf / branche / sector', waarde: '€ 150/uur (gem. 2 uur per les, excl. reistijd)' },
      { sectie: 'Maatschappelijke activiteiten', label: 'Bedrijfsbezoek', waarde: '€ 150/uur (gem. 4 uur per bezoek, excl. reistijd)' },
      { sectie: 'Sociaal investeren (max. 25%)', label: 'Investering in sociaal initiatief / platform', waarde: 'Max. 25% van totale SR-verplichting (min. € 10.000)' },
      { sectie: 'Open sociale impact (max. 10%)', label: 'Maatwerk activiteit (na goedkeuring accountmanager)', waarde: 'Max. 10% van totale SR-verplichting (min. € 10.000)' },
    ],
    isSeeded: true,
  },
  {
    naam: 'Vlaardingen', gmCode: 'GM0622', provincie: 'Zuid-Holland',
    werkloosheid: 6.2, bijstand: 2490, buigBudget: 44820000, reintegratiebudget: 4033800,
    sroi: { pct: 5, status: 'Actief', drempel: null, monitoring: 'Kwartaal', methode: 'Bouwblokken (impactwaardering)', uitvoerder: 'Stroomopwaarts MVS', registratiesysteem: 'sroi@stroomopwaarts.nl' },
    doelgroepen: { bijstand: { n: 2490, bereikbaarheid: 65 }, nuggers: { n: 872, bereikbaarheid: 42 }, statushouders: { n: 299, bereikbaarheid: 35 }, vsv: { n: 199, bereikbaarheid: 22 }, arbeidsbeperkt: { n: 498, bereikbaarheid: 45 }, ouderen55plus: { n: 374, bereikbaarheid: 30 } },
    instellingen: ['Stroomopwaarts MVS', 'WSPR Rijnmond'],
    bouwblokwaarden: [
      // Werken — impactwaardering (niet gekoppeld aan loonkosten)
      { sectie: 'Werken', label: 'Participatiewet', waarde: '€ 24,04/uur | € 50.000/jaar (max 3 jr na uitkering)' },
      { sectie: 'Werken', label: 'Banenafspraak / Doelgroepregister / WIA / WAO', waarde: '€ 24,04/uur | € 50.000/jaar (altijd opvoerbaar)' },
      { sectie: 'Werken', label: 'WW-uitkering', waarde: '€ 12,02/uur | € 25.000/jaar (max 2 jr na uitkering)' },
      { sectie: 'Werken', label: 'NUG (Niet-Uitkeringsgerechtigde)', waarde: '€ 7,21/uur | € 15.000/jaar (max 2 jaar)' },
      { sectie: 'Bonussen', label: 'Bonus vast contract (onbepaalde tijd)', waarde: '1× jaarwaardering doelgroep' },
      { sectie: 'Bonussen', label: 'Bonus 56+ in dienst nemen', waarde: '€ 2,40/uur extra | € 5.000/jaar' },
      // Leren
      { sectie: 'Leren', label: 'Leerling BBL (mbo niveau 1–4)', waarde: '€ 7,21/uur | € 15.000/jaar' },
      { sectie: 'Leren', label: 'Leerling VSO / praktijkonderwijs', waarde: '€ 7,21/uur | € 15.000/jaar' },
      { sectie: 'Leren', label: 'Stagiaire / leerling BOL', waarde: '€ 3,60/uur | € 7.500/jaar' },
      { sectie: 'Leren', label: 'Vakinhoudelijke training / coaching', waarde: 'Gefactureerde kosten excl. btw' },
      { sectie: 'Leren', label: 'Taaltraining (bonus)', waarde: 'Gefactureerde kosten + 100% bonus tot € 2.000' },
      // Overig
      { sectie: 'Sociaal inkopen', label: 'Inkopen bij erkend sociaal ondernemer (WSP Rijnmond)', waarde: 'Volledig factuurbedrag excl. btw' },
      { sectie: 'Maatschappelijke activiteiten', label: 'Gastles over bedrijf / branche / sector', waarde: '€ 150/uur (gem. 2 uur per les, excl. reistijd)' },
      { sectie: 'Maatschappelijke activiteiten', label: 'Bedrijfsbezoek', waarde: '€ 150/uur (gem. 4 uur per bezoek, excl. reistijd)' },
      { sectie: 'Sociaal investeren (max. 25%)', label: 'Investering in sociaal initiatief / platform', waarde: 'Max. 25% van totale SR-verplichting (min. € 10.000)' },
      { sectie: 'Open sociale impact (max. 10%)', label: 'Maatwerk activiteit (na goedkeuring accountmanager)', waarde: 'Max. 10% van totale SR-verplichting (min. € 10.000)' },
    ],
    isSeeded: true,
  },
  {
    naam: 'Schiedam', gmCode: 'GM0606', provincie: 'Zuid-Holland',
    werkloosheid: 6.5, bijstand: 2830, buigBudget: 50940000, reintegratiebudget: 4584600,
    sroi: { pct: 5, status: 'Actief', drempel: null, monitoring: 'Kwartaal', methode: 'Bouwblokken (impactwaardering)', uitvoerder: 'Stroomopwaarts MVS', registratiesysteem: 'sroi@stroomopwaarts.nl' },
    doelgroepen: { bijstand: { n: 2830, bereikbaarheid: 65 }, nuggers: { n: 991, bereikbaarheid: 42 }, statushouders: { n: 340, bereikbaarheid: 35 }, vsv: { n: 226, bereikbaarheid: 22 }, arbeidsbeperkt: { n: 566, bereikbaarheid: 45 }, ouderen55plus: { n: 425, bereikbaarheid: 30 } },
    instellingen: ['Stroomopwaarts MVS', 'WSPR Rijnmond'],
    bouwblokwaarden: [
      // Werken — impactwaardering (niet gekoppeld aan loonkosten)
      { sectie: 'Werken', label: 'Participatiewet', waarde: '€ 24,04/uur | € 50.000/jaar (max 3 jr na uitkering)' },
      { sectie: 'Werken', label: 'Banenafspraak / Doelgroepregister / WIA / WAO', waarde: '€ 24,04/uur | € 50.000/jaar (altijd opvoerbaar)' },
      { sectie: 'Werken', label: 'WW-uitkering', waarde: '€ 12,02/uur | € 25.000/jaar (max 2 jr na uitkering)' },
      { sectie: 'Werken', label: 'NUG (Niet-Uitkeringsgerechtigde)', waarde: '€ 7,21/uur | € 15.000/jaar (max 2 jaar)' },
      { sectie: 'Bonussen', label: 'Bonus vast contract (onbepaalde tijd)', waarde: '1× jaarwaardering doelgroep' },
      { sectie: 'Bonussen', label: 'Bonus 56+ in dienst nemen', waarde: '€ 2,40/uur extra | € 5.000/jaar' },
      // Leren
      { sectie: 'Leren', label: 'Leerling BBL (mbo niveau 1–4)', waarde: '€ 7,21/uur | € 15.000/jaar' },
      { sectie: 'Leren', label: 'Leerling VSO / praktijkonderwijs', waarde: '€ 7,21/uur | € 15.000/jaar' },
      { sectie: 'Leren', label: 'Stagiaire / leerling BOL', waarde: '€ 3,60/uur | € 7.500/jaar' },
      { sectie: 'Leren', label: 'Vakinhoudelijke training / coaching', waarde: 'Gefactureerde kosten excl. btw' },
      { sectie: 'Leren', label: 'Taaltraining (bonus)', waarde: 'Gefactureerde kosten + 100% bonus tot € 2.000' },
      // Overig
      { sectie: 'Sociaal inkopen', label: 'Inkopen bij erkend sociaal ondernemer (WSP Rijnmond)', waarde: 'Volledig factuurbedrag excl. btw' },
      { sectie: 'Maatschappelijke activiteiten', label: 'Gastles over bedrijf / branche / sector', waarde: '€ 150/uur (gem. 2 uur per les, excl. reistijd)' },
      { sectie: 'Maatschappelijke activiteiten', label: 'Bedrijfsbezoek', waarde: '€ 150/uur (gem. 4 uur per bezoek, excl. reistijd)' },
      { sectie: 'Sociaal investeren (max. 25%)', label: 'Investering in sociaal initiatief / platform', waarde: 'Max. 25% van totale SR-verplichting (min. € 10.000)' },
      { sectie: 'Open sociale impact (max. 10%)', label: 'Maatwerk activiteit (na goedkeuring accountmanager)', waarde: 'Max. 10% van totale SR-verplichting (min. € 10.000)' },
    ],
    isSeeded: true,
  },
];

export const seededByGmCode = new Map<string, GemeenteInfo>(
  seededGemeenten.map((g) => [g.gmCode, g])
);
