
import type { GemeenteInfo } from '../../types';

export default function SuccessenTab({ g }: { g: GemeenteInfo }) {
  return (
    <div className="p-4 space-y-3">
      {g.instellingen.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-blauw mb-2">Uitvoerende instellingen</p>
          <div className="flex flex-wrap gap-2">
            {g.instellingen.map((inst, i) => (
              <span key={i} className="bg-bg-alt text-blauw text-xs px-3 py-1.5 rounded-full border border-lijn">{inst}</span>
            ))}
          </div>
        </div>
      )}
      {g.contactpersonen && g.contactpersonen.map((cp, i) => (
        <div key={i} className="bg-bg-alt rounded-xl p-3 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-blauw">{cp.naam}</p>
            {cp.regio && <p className="text-xs text-grijs">{cp.regio}</p>}
          </div>
          <a href={`tel:${cp.telefoon}`} className="text-sm text-magenta hover:underline font-medium">{cp.telefoon}</a>
        </div>
      ))}
      {g.sroi.beleidsdocumentUrl && (
        <a href={g.sroi.beleidsdocumentUrl} target="_blank" rel="noopener noreferrer"
          className="block text-xs text-magenta hover:underline">
          Bekijk gemeentelijk SROI-beleid \u2192
        </a>
      )}
      {!g.isSeeded && (
        <p className="text-xs text-grijs italic">Succesverhalen en contactinfo volgen zodra deze gemeente volledig is ingevuld.</p>
      )}
    </div>
  );
}
