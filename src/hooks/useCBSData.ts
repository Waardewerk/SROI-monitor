
import { useState, useEffect } from 'react';
import { deriveGemeenteInfo } from '../types';
import type { GemeenteInfo } from '../types';
import { seededByGmCode } from '../data/gemeenten';

interface CBSRecord {
  GemeentecodeRegiocode: string;
  Gemeentenaam: string;
  BijstandsuitkeringenTotaal_1?: number;
  WerkloosheidspercentageAangepast_3?: number;
}

const CBS_BASE = 'https://opendata.cbs.nl/ODataApi/OData/85265NED/UntypedDataSet';
const CBS_SELECT = 'GemeentecodeRegiocode,Gemeentenaam,BijstandsuitkeringenTotaal_1,WerkloosheidspercentageAangepast_3';

async function fetchCBS(periode: string): Promise<CBSRecord[]> {
  const url = `${CBS_BASE}?$filter=Perioden eq '${periode}'&$select=${CBS_SELECT}&$format=json&$top=500`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`CBS ${resp.status}`);
  const json = await resp.json();
  return json.value ?? [];
}

export function useCBSData() {
  const [alle, setAlle] = useState<GemeenteInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        // Try 2024, fall back to 2023 if empty
        let records = await fetchCBS('2024JJ00');
        if (records.filter(r => r.GemeentecodeRegiocode?.startsWith('GM')).length < 10) {
          records = await fetchCBS('2023JJ00');
        }

        const result: GemeenteInfo[] = records
          .filter(r => r.GemeentecodeRegiocode?.startsWith('GM'))
          .map(r => {
            const gmCode = r.GemeentecodeRegiocode.trim();
            if (seededByGmCode.has(gmCode)) return seededByGmCode.get(gmCode)!;
            const bijstand = Number(r.BijstandsuitkeringenTotaal_1) || 0;
            const werkloosheid = r.WerkloosheidspercentageAangepast_3
              ? Number(r.WerkloosheidspercentageAangepast_3)
              : undefined;
            return deriveGemeenteInfo(gmCode, r.Gemeentenaam?.trim() ?? gmCode, bijstand, werkloosheid);
          })
          .filter(g => g.bijstand > 0 || g.isSeeded);

        // Add seeded not in CBS
        const cbsCodes = new Set(result.map(g => g.gmCode));
        seededByGmCode.forEach((g, code) => { if (!cbsCodes.has(code)) result.push(g); });

        result.sort((a, b) => b.bijstand - a.bijstand);
        setAlle(result);
      } catch (e) {
        setError(String(e));
        const fallback = Array.from(seededByGmCode.values()).sort((a, b) => b.bijstand - a.bijstand);
        setAlle(fallback);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { alle, loading, error };
}
