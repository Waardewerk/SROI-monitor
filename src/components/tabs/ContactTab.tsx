import { Mail, Phone } from 'lucide-react';
import type { GemeenteInfo } from '../../types';

export default function ContactTab({ g }: { g: GemeenteInfo }) {
  return (
    <div className="space-y-4">
      {g.contactpersonen && g.contactpersonen.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-blauw uppercase tracking-wide">Contactpersonen SROI</p>
          {g.contactpersonen.map((cp, i) => (
            <div key={i} className="bg-bg-alt rounded-xl p-3 space-y-0.5">
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
      ) : (
        <p className="text-xs text-grijs italic">Geen contactgegevens beschikbaar voor deze gemeente.</p>
      )}
    </div>
  );
}
