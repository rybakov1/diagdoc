import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PsaBrandLogos } from "./psa-brand-logos";

export function PsaEntry() {
  return (
    <Link href="/codes/peugeot-citroen/" className="psa-entry">
      <PsaBrandLogos className="psa-entry-icon" />
      <span><strong>Peugeot и Citroën</strong><small>Расшифровки кодов и порядок первичной диагностики</small></span>
      <ChevronRight aria-hidden="true" size={20} className="psa-chevron" />
    </Link>
  );
}
