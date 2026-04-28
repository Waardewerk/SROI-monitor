
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { GemeenteInfo } from '../types';

const GEO_URL = 'https://cartomap.github.io/nl/wgs84/gemeente_2024.geojson';

// Netherlands bounding box (loose padding so Friesland + Zeeland fit)
const NL_BOUNDS = L.latLngBounds(
  L.latLng(50.6, 3.2),   // SW
  L.latLng(53.7, 7.3)    // NE
);
const NL_CENTER: L.LatLngExpression = [52.35, 5.27];
const INIT_ZOOM = 7;

function getColor(g: GemeenteInfo | undefined, isSelected: boolean): string {
  if (isSelected) return '#C2185B';
  if (!g) return '#e4ecf5';
  switch (g.sroi.status) {
    case 'Verplicht': {
      const b = g.bijstand;
      if (b > 20000) return '#1b5e20';
      if (b > 10000) return '#2e7d32';
      if (b > 5000)  return '#388e3c';
      if (b > 2000)  return '#43a047';
      return '#66bb6a';
    }
    case 'Actief':
    case 'Actief beleid': return '#90caf9';
    default: return '#cfd8e8';
  }
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

  useEffect(() => { exportSelectedRef.current = exportSelected; }, [exportSelected]);

  function muniStyle(g: GemeenteInfo | undefined, sel: boolean): L.PathOptions {
    return {
      fillColor: getColor(g, sel),
      fillOpacity: g?.sroi.status === 'Verplicht' ? 0.80 : 0.55,
      color: '#7a8fa8',
      weight: 0.8,
    };
  }

  // Build lookup + re-style
  useEffect(() => {
    const m = new Map<string, GemeenteInfo>();
    gemeenten.forEach(g => m.set(g.gmCode, g));
    dataMapRef.current = m;
    if (geojsonRef.current) {
      geojsonRef.current.setStyle((feature) => {
        const code = feature?.properties?.statcode as string | undefined;
        const g = code ? m.get(code) : undefined;
        const sel = code ? exportSelectedRef.current.has(code) : false;
        return muniStyle(g, sel);
      });
    }
  }, [gemeenten]);

  // Re-style on selection change
  useEffect(() => {
    if (!geojsonRef.current) return;
    geojsonRef.current.setStyle((feature) => {
      const code = feature?.properties?.statcode as string | undefined;
      const g = code ? dataMapRef.current.get(code) : undefined;
      const sel = code ? exportSelected.has(code) : false;
      return muniStyle(g, sel);
    });
  }, [exportSelected]);

  // Init map once
  useEffect(() => {
    if (!divRef.current || mapRef.current) return;

    const map = L.map(divRef.current, {
      center: NL_CENTER,
      zoom: INIT_ZOOM,
      minZoom: 6,
      maxZoom: 16,
      zoomControl: true,
      // Soft boundary: bounces back when panning too far from NL
      maxBounds: L.latLngBounds(L.latLng(48.0, 0.5), L.latLng(55.5, 10.0)),
      maxBoundsViscosity: 0.7,
    });

    // CartoDB Positron No Labels — clean grey background, no country/city text
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> &copy; <a href="https://carto.com">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    fetch(GEO_URL)
      .then(r => r.json())
      .then(geojson => {
        const layer = L.geoJSON(geojson, {
          style: (feature) => {
            const code = feature?.properties?.statcode as string | undefined;
            const g = code ? dataMapRef.current.get(code) : undefined;
            return muniStyle(g, false);
          },
          onEachFeature: (feature, lyr) => {
            const code = feature.properties?.statcode as string | undefined;
            const naam = feature.properties?.statnaam as string | undefined;
            lyr.on({
              mouseover: (e) => {
                const p = e.target as L.Path;
                p.setStyle({ weight: 2, color: '#C2185B', fillOpacity: 0.9 });
                p.bringToFront();
              },
              mouseout: () => {
                const g = code ? dataMapRef.current.get(code) : undefined;
                const sel = code ? exportSelectedRef.current.has(code) : false;
                (lyr as unknown as L.Path).setStyle(muniStyle(g, sel));
              },
              click: () => {
                const g = code ? dataMapRef.current.get(code) : undefined;
                const target = g ?? (naam ? {
                  naam, gmCode: code ?? '', bijstand: 0, buigBudget: 0, reintegratiebudget: 0,
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
                  onSelect(target);
                  if (!exportSelectedRef.current.size) {
                    const bounds = (lyr as unknown as { getBounds?: () => L.LatLngBounds }).getBounds?.();
                    if (bounds) map.fitBounds(bounds, { maxZoom: 13, animate: true, padding: [20, 20] });
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
          const g = code ? dataMapRef.current.get(code) : undefined;
          return muniStyle(g, false);
        });
      })
      .catch(console.error);

    return () => { map.remove(); mapRef.current = null; geojsonRef.current = null; };
  }, [onSelect]);

  // Zoom to search result — fit within NL, don't fly to Siberia
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
      const bounds = (found as unknown as { getBounds?: () => L.LatLngBounds }).getBounds?.();
      if (bounds) mapRef.current!.fitBounds(bounds, { maxZoom: 13, animate: true, padding: [40, 40] });
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
        .leaflet-container { background: #e8ecf0; }
      `}</style>
      <div ref={divRef} className="w-full h-full" />
    </>
  );
}
