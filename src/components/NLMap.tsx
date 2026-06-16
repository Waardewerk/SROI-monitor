
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { GemeenteInfo } from '../types';
import { seededProvincies } from '../data/gemeenten';

const GEO_URL  = 'https://cartomap.github.io/nl/wgs84/gemeente_2024.geojson';
const PROV_URL = 'https://cartomap.github.io/nl/wgs84/provincie_2024.geojson';

const NL_BOUNDS = L.latLngBounds(L.latLng(50.6, 3.2), L.latLng(53.7, 7.3));
const NL_CENTER: L.LatLngExpression = [52.35, 5.27];

// Build lookup: province naam → GemeenteInfo (province entry)
const provincieByNaam = new Map<string, GemeenteInfo>(
  seededProvincies.map(p => [p.naam.replace('Provincie ', ''), p])
);

// Aliassen voor GeoJSON statnaam → gmCode
// (GeoJSON gebruikt officiële namen zoals 's-Gravenhage, wij slaan op als 'Den Haag')
const GEOJSON_NAAM_ALIAS: Record<string, string> = {
  "'s-Gravenhage": 'GM0518',
  "'s-Hertogenbosch": 'GM0796',
};

function getColor(g: GemeenteInfo | undefined, isSelected: boolean): string {
  if (isSelected) return '#C2185B';
  if (!g) return '#e4ecf5';
  switch (g.sroi.status) {
    case 'Verplicht':    return '#2e7d32';
    case 'Actief':
    case 'Actief beleid': return '#90caf9';
    case 'In ontwikkeling': return '#f59e0b';
    case 'Geen data':    return '#fed7aa';
    default:             return '#cfd8e8';
  }
}

function muniStyle(g: GemeenteInfo | undefined, sel: boolean): L.PathOptions {
  return {
    fillColor: getColor(g, sel),
    fillOpacity: 0.70,
    color: '#7a8fa8',
    weight: 0.8,
  };
}


interface Props {
  gemeenten: GemeenteInfo[];
  zoek: string;
  onSelect: (g: GemeenteInfo) => void;
  exportMode?: boolean;
  exportSelected?: Set<string>;
}

export default function NLMap({ gemeenten, zoek, onSelect, exportSelected = new Set() }: Props) {
  const divRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const geojsonRef = useRef<L.GeoJSON | null>(null);
  const dataMapRef = useRef<Map<string, GemeenteInfo>>(new Map());
  const exportSelectedRef = useRef(exportSelected);
  const onSelectRef = useRef(onSelect);
  useEffect(() => { onSelectRef.current = onSelect; }, [onSelect]);
  useEffect(() => { exportSelectedRef.current = exportSelected; }, [exportSelected]);

  // Build lookup + re-style gemeenten
  useEffect(() => {
    const m = new Map<string, GemeenteInfo>();
    gemeenten.forEach(g => m.set(g.gmCode, g));
    dataMapRef.current = m;
    if (geojsonRef.current) {
      geojsonRef.current.setStyle((feature) => {
        const code = feature?.properties?.statcode as string | undefined;
        const naam = feature?.properties?.statnaam as string | undefined;
        const aliasCode = naam ? GEOJSON_NAAM_ALIAS[naam] : undefined;
        const g = (code ? m.get(code) : undefined) ?? (aliasCode ? m.get(aliasCode) : undefined);
        const effectiveCode = code ?? aliasCode ?? '';
        const sel = effectiveCode ? exportSelectedRef.current.has(effectiveCode) : false;
        return muniStyle(g, sel);
      });
    }
  }, [gemeenten]);

  // Re-style on selection change
  useEffect(() => {
    if (!geojsonRef.current) return;
    geojsonRef.current.setStyle((feature) => {
      const code = feature?.properties?.statcode as string | undefined;
      const naam = feature?.properties?.statnaam as string | undefined;
      const aliasCode = naam ? GEOJSON_NAAM_ALIAS[naam] : undefined;
      const g = (code ? dataMapRef.current.get(code) : undefined) ?? (aliasCode ? dataMapRef.current.get(aliasCode) : undefined);
      const effectiveCode = code ?? aliasCode ?? '';
      const sel = effectiveCode ? exportSelected.has(effectiveCode) : false;
      return muniStyle(g, sel);
    });
  }, [exportSelected]);

  // Init map ONCE
  useEffect(() => {
    if (!divRef.current || mapRef.current) return;

    const map = L.map(divRef.current, {
      center: NL_CENTER,
      zoom: 7,
      minZoom: 6,
      maxZoom: 16,
      zoomControl: true,
      maxBounds: L.latLngBounds(L.latLng(48.0, 0.5), L.latLng(55.5, 10.0)),
      maxBoundsViscosity: 0.7,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> &copy; <a href="https://carto.com">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    const labelLayer = L.layerGroup().addTo(map);

    function updateLabels() {
      const z = map.getZoom();
      const el = map.getContainer();
      el.classList.toggle('zoom-labels-large', z >= 8);
      el.classList.toggle('zoom-labels-all', z >= 10);
    }
    map.on('zoomend', updateLabels);

    // ── Gemeente layer ────────────────────────────────────────────────────────
    fetch(GEO_URL)
      .then(r => r.json())
      .then(geojson => {
        const layer = L.geoJSON(geojson, {
          style: (feature) => {
            const code = feature?.properties?.statcode as string | undefined;
            const naam = feature?.properties?.statnaam as string | undefined;
            const aliasCode = naam ? GEOJSON_NAAM_ALIAS[naam] : undefined;
            const g = (code ? dataMapRef.current.get(code) : undefined) ?? (aliasCode ? dataMapRef.current.get(aliasCode) : undefined);
            return muniStyle(g, false);
          },
          onEachFeature: (feature, lyr) => {
            const code = feature.properties?.statcode as string | undefined;
            const naam = feature.properties?.statnaam as string | undefined;
            const aliasCode = naam ? GEOJSON_NAAM_ALIAS[naam] : undefined;
            const effectiveCode = code ?? aliasCode;
            const g = (code ? dataMapRef.current.get(code) : undefined) ?? (aliasCode ? dataMapRef.current.get(aliasCode) : undefined);

            if (naam) {
              const bounds = (lyr as unknown as L.GeoJSON).getBounds?.();
              if (bounds) {
                const isLarge = g ? g.bijstand > 8000 : false;
                const marker = L.marker(bounds.getCenter(), {
                  icon: L.divIcon({
                    className: isLarge ? 'gemeente-label label-large' : 'gemeente-label label-small',
                    html: `<span>${naam}</span>`,
                    iconSize: undefined,
                    iconAnchor: undefined,
                  }),
                  interactive: false,
                  zIndexOffset: -1000,
                });
                labelLayer.addLayer(marker);
              }
            }

            lyr.on({
              mouseover: (e) => {
                const p = e.target as L.Path;
                p.setStyle({ weight: 2, color: '#C2185B', fillOpacity: 0.9 });
                p.bringToFront();
              },
              mouseout: () => {
                const g2 = (effectiveCode ? dataMapRef.current.get(effectiveCode) : undefined);
                const sel = effectiveCode ? exportSelectedRef.current.has(effectiveCode) : false;
                (lyr as unknown as L.Path).setStyle(muniStyle(g2, sel));
              },
              click: () => {
                const g2 = effectiveCode ? dataMapRef.current.get(effectiveCode) : undefined;
                const target = g2 ?? (naam ? {
                  naam: g2?.naam ?? naam, gmCode: effectiveCode ?? code ?? '', bijstand: 0, buigBudget: 0, reintegratiebudget: 0,
                  sroi: { pct: 5, status: 'In ontwikkeling' as const, drempel: 250000 },
                  doelgroepen: {
                    bijstand:      { n: 0, bereikbaarheid: 0 },
                    nuggers:       { n: 0, bereikbaarheid: 0 },
                    statushouders: { n: 0, bereikbaarheid: 0 },
                    vsv:           { n: 0, bereikbaarheid: 0 },
                    arbeidsbeperkt:{ n: 0, bereikbaarheid: 0 },
                    ouderen55plus: { n: 0, bereikbaarheid: 0 },
                  },
                  instellingen: [], isSeeded: false,
                } : null);
                if (target) {
                  onSelectRef.current(target);
                  if (!exportSelectedRef.current.size) {
                    const b2 = (lyr as unknown as { getBounds?: () => L.LatLngBounds }).getBounds?.();
                    if (b2) map.fitBounds(b2, { maxZoom: 13, animate: true, padding: [20, 20] });
                  }
                }
              },
            });
            lyr.bindTooltip(naam ?? '', { sticky: true, className: 'gemeente-tooltip' });
          },
        }).addTo(map);
        geojsonRef.current = layer;
        layer.setStyle((feature) => {
          const code = feature?.properties?.statcode as string | undefined;
          const naam = feature?.properties?.statnaam as string | undefined;
          const aliasCode = naam ? GEOJSON_NAAM_ALIAS[naam] : undefined;
          const g = (code ? dataMapRef.current.get(code) : undefined) ?? (aliasCode ? dataMapRef.current.get(aliasCode) : undefined);
          return muniStyle(g, false);
        });
        updateLabels();
      })
      .catch(console.error);

    // ── Provincie layer — alleen visueel, geen klik-onderschepping ─────────
    fetch(PROV_URL)
      .then(r => r.json())
      .then(geojson => {
        // Niet-interactieve grenslaag: klikken gaan door naar gemeenten eronder
        L.geoJSON(geojson, {
          interactive: false,
          style: (feature) => {
            const naam = feature?.properties?.statnaam as string | undefined;
            const isSeeded = naam ? provincieByNaam.has(naam) : false;
            return isSeeded
              ? { fillOpacity: 0, color: '#9333ea', weight: 1.5, opacity: 0.55, dashArray: '7 5' }
              : { fillOpacity: 0, color: '#9333ea', weight: 0.7, opacity: 0.18, dashArray: '4 4' };
          },
        }).addTo(map);

        // Klikbaar label-icoon in het centrum van elke seeded provincie
        (geojson as GeoJSON.FeatureCollection).features.forEach(feature => {
          const naam = feature.properties?.statnaam as string | undefined;
          const provInfo = naam ? provincieByNaam.get(naam) : undefined;
          if (!provInfo) return;

          // Bereken center via bounds van alle coordinaten
          const coords: number[][] = [];
          const collect = (c: unknown): void => {
            if (Array.isArray(c) && typeof c[0] === 'number') { coords.push(c as number[]); }
            else if (Array.isArray(c)) c.forEach(collect);
          };
          collect(feature.geometry);
          if (!coords.length) return;
          const lats = coords.map(c => c[1]);
          const lngs = coords.map(c => c[0]);
          const center = L.latLng(
            (Math.min(...lats) + Math.max(...lats)) / 2,
            (Math.min(...lngs) + Math.max(...lngs)) / 2
          );

          const shortName = provInfo.naam.replace('Provincie ', '');
          const marker = L.marker(center, {
            icon: L.divIcon({
              className: 'provincie-badge',
              html: `<div class="prov-btn">🏛 ${shortName}</div>`,
              iconSize: [130, 28],
              iconAnchor: [65, 14],
            }),
            zIndexOffset: 600,
            interactive: true,
          });
          marker.on('click', () => {
            onSelectRef.current(provInfo);
            map.setView(center, Math.max(map.getZoom(), 9), { animate: true });
          });
          marker.bindTooltip(`Klik voor SROI-info: ${provInfo.naam}`, {
            sticky: false,
            className: 'gemeente-tooltip provincie-tooltip',
          });
          marker.addTo(map);
        });
      })
      .catch(console.error);

    return () => { map.remove(); mapRef.current = null; geojsonRef.current = null; };
  }, []);

  // Zoom to search
  useEffect(() => {
    if (!mapRef.current || !geojsonRef.current) return;
    if (!zoek.trim()) {
      mapRef.current.fitBounds(NL_BOUNDS, { animate: true });
      return;
    }
    const q = zoek.toLowerCase();
    let found: L.Layer | null = null;
    geojsonRef.current.eachLayer(lyr => {
      const f = (lyr as L.GeoJSON & { feature?: GeoJSON.Feature }).feature;
      const naam = f?.properties?.statnaam as string | undefined;
      if (naam?.toLowerCase().startsWith(q)) found = lyr;
    });
    if (found) {
      const b = (found as unknown as { getBounds?: () => L.LatLngBounds }).getBounds?.();
      if (b) mapRef.current!.fitBounds(b, { maxZoom: 13, animate: true, padding: [40, 40] });
    }
  }, [zoek]);

  return (
    <>
      <style>{`
        .gemeente-tooltip {
          background: #1a1a2e; color: white; border: none; border-radius: 6px;
          padding: 4px 10px; font-size: 12px; font-weight: 500;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        .gemeente-tooltip::before { display: none; }
        .provincie-tooltip {
          background: #581c87 !i