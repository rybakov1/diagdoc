import Link from "next/link";
import { CarFront, Info } from "lucide-react";
import { PsaCatalog } from "@/components/platform/psa-catalog";
import { psaCatalogPath, psaCodes, psaVehicleDocs } from "@/data/psa-codes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Коды ошибок Peugeot и Citroën",
  description: "257 диагностических кодов Peugeot и Citroën. Поиск по коду и системе автомобиля, расшифровка и порядок первичной проверки.",
  path: psaCatalogPath,
});

export default function Page() {
  return (
    <div className="workspace psa-page">
      <nav className="work-breadcrumbs" aria-label="Хлебные крошки"><Link href="/codes/">Коды ошибок</Link><span>/</span><span>Peugeot и Citroën</span></nav>
      <header className="psa-hero">
        <div>
          <div className="work-kicker">Каталог по маркам</div>
          <h1 className="work-heading">Коды Peugeot и Citroën</h1>
          <p className="work-subtitle">Найдите свой код и посмотрите, какие параметры и цепи проверить в первую очередь.</p>
        </div>
        <div className="psa-hero-mark" aria-hidden="true"><CarFront size={44} strokeWidth={1.45} /></div>
      </header>
      <div className="work-demo psa-note">
        <Info aria-hidden="true" size={19} />
        <span>Формулировка зависит от двигателя и блока управления. Перед проверкой сверяйте полный текст ошибки и применимость <a href={psaVehicleDocs}>по VIN в Service Box</a>.</span>
      </div>
      <PsaCatalog items={psaCodes} />
    </div>
  );
}
