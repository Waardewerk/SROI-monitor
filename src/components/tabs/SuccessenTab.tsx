
import type { GemeenteInfo } from '../../types';

export default function SuccessenTab({ g }: { g: GemeenteInfo }) {
  return (
    <div className="p-4 space-y-4">
      {/* Instellingen */}
      {g.instellingen.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-blauw mb-2">Uitvoerende instellingen</p>
          <div className="flex flex-wrap gap-2">
            {g.instellingen.map((inst, i) => (
              <span key={i} className="bg-bg-alt text-blauw text-xs px-3 py-1.5 rounded-full border border-lijn">
                {inst}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Contactpersonen */}
      {g.contactpersonen && g.contactpersonen.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-blauw">Contactpersonen</p>
          {g.contactpersonen.map((cp, i) => (
            <div key={i} className="bg-bg-alt rounded-xl p-3 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-blauw">{cp.naam}</p>
                {cp.regio && <p className="text-xs text-grijs">{cp.regio}</p>}
              </div>
              <a href={`tel:${cp.telefoon}`} className="text-sm text-magenta hover:underline font-medium">
                {cp.telefoon}
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Succesverhalen */}
      {g.succesverhalen && g.succesverhalen.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-blauw">Succesverhalen</p>
          {g.succesverhalen.map((s, i) => (
            <div key={i} className="rounded-xl border border-lijn p-3 bg-bg-alt">
              <p className="text-xs font-semibold text-blauw mb-1">{s.titel}</p>
              <p className="text-xs text-grijs leading-relaxed">{s.tekst}</p>
            </div>
          ))}
        </div>
      )}

      {/* Beleidsdocument */}
      {g.sroi.beleidsdocumentUrl && (
        <a href={g.sroi.beleidsdocumentUrl} target="_blank" rel="noopener noreferrer"
           className="block text-xs text-magenta hover:underline">
          Bekijk gemeentelijk SROI-beleid →
        </a>
      )}

      {!g.isSeeded && (
        <p className="text-xs text-grijs italic">
          Succesverhalen en contactinfo volgen zodra deze gemeente volledig is ingevuld.
        </p>
      )}
    </div>
  );
}
