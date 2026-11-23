import Link from "next/link";
import { CarFront, ChevronRight } from "lucide-react";

export function PsaEntry() {
  return (
    <Link href="/codes/peugeot-citroen/" className="psa-entry">
      <span className="psa-entry-icon"><CarFront aria-hidden="true" size={24} /></span>
      <span><strong>Peugeot и Citroën</strong><small>Расшифровки кодов и порядок первичной диагностики</small></span>
      <ChevronRight aria-hidden="true" size={20} className="psa-chevron" />
    </Link>
  );
}
