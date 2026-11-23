import Link from "next/link";
import { AlertTriangle, ChevronRight, ClipboardCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { psaCatalogPath, psaCodes, psaNextStep, psaServiceBox } from "@/data/psa-codes";
import { psaPlans } from "@/data/psa-checks";
import { breadcrumbJsonLd, jsonLd, pageMetadata } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() {
  return psaCodes.map(item => ({ id: item.code.toLowerCase() }));
}

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const item = psaCodes.find(entry => entry.code.toLowerCase() === id);
  if (!item) return {};
  return pageMetadata({
    title: `Ошибка ${item.code} Peugeot и Citroën — что проверить`,
    description: `${item.code}: ${item.subject}. Что проверить по расшифровке Peugeot/Citroën и как уточнить применимость для своего автомобиля.`,
    path: `${psaCatalogPath}${id}/`,
  });
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const item = psaCodes.find(entry => entry.code.toLowerCase() === id);
  if (!item) notFound();
  const plan = psaPlans[item.family];
  const caution = "caution" in plan ? plan.caution : undefined;
  const related = psaCodes.filter(entry => entry.family === item.family && entry.code !== item.code)
    .sort((a, b) => Math.abs(parseInt(a.code.slice(1), 16) - parseInt(id.slice(1), 16)) -
      Math.abs(parseInt(b.code.slice(1), 16) - parseInt(id.slice(1), 16))).slice(0, 4);
  const crumbs = [
    { label: "Главная", href: "/" },
    { label: "Коды ошибок", href: "/codes/" },
    { label: "Peugeot и Citroën", href: psaCatalogPath },
    { label: item.code, href: `${psaCatalogPath}${id}/` },
  ];

  return (
    <div className="workspace psa-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbJsonLd(crumbs)) }} />
      <nav aria-label="Хлебные крошки" className="work-breadcrumbs">
        {crumbs.slice(1, -1).map(crumb => <span key={crumb.href} className="psa-crumb"><Link href={crumb.href}>{crumb.label}</Link><span>/</span></span>)}
        <span>{item.code}</span>
      </nav>
      <header className="psa-hero psa-detail-hero">
        <div>
          <div className="work-kicker">Peugeot и Citroën</div>
          <h1 className="work-heading">Ошибка {item.code}</h1>
          <p className="work-subtitle">{item.subject}</p>
        </div>
        <span className="work-chip orange">{item.system}</span>
      </header>
      <div className="work-split">
        <article>
          <section className="work-panel work-block psa-section">
            <h2>Что означает код</h2>
            <p>{item.detail}.</p>
            <p className="psa-muted">Это формулировка из подборки Peugeot/Citroën. Применимость к конкретной машине подтверждают по VIN, блоку управления и полному тексту ошибки.</p>
            {item.code === "P0420" && <Link className="work-text-link" href="/codes/p0420/">Универсальная расшифровка P0420</Link>}
          </section>
          {caution && (
            <div className="work-demo psa-note"><AlertTriangle size={19} aria-hidden="true" /><span><strong>Безопасность. </strong>{caution}</span></div>
          )}
          <section className="work-panel work-block psa-section">
            <h2>Что делать</h2>
            <ol className="psa-steps">
              <li><strong>Сохраните данные.</strong> Запишите блок, полный текст, подкод, статус и стоп-кадр до очистки памяти. Сверьте расшифровку со своим ЭБУ.</li>
              <li><strong>Проверьте указанное отклонение.</strong> {psaNextStep(item)}</li>
              <li><strong>Сопоставьте параметры.</strong> {plan.checks[0]}</li>
              <li><strong>Локализуйте причину.</strong> {plan.checks[1]}</li>
            </ol>
            <p className="psa-muted">После устранения подтверждённой причины повторите контроль по процедуре производителя и убедитесь, что код не возвращается в тех же условиях.</p>
          </section>
        </article>
        <aside>
          <section className="work-panel work-block psa-section">
            <h2>Источники</h2>
            <p>Расшифровка из предоставленной подборки кодов Peugeot/Citroën, стр. {item.page}.</p>
            <p>Порядок действий — редакционная подсказка для первичной проверки. Точки измерения, допуски и условия теста подбираются по автомобилю.</p>
            <Link className="work-text-link" href={psaServiceBox}>Таблицы кодов в Service Box</Link>
          </section>
          {related.length > 0 && <section className="work-panel work-block psa-section">
            <h2>Коды той же системы</h2>
            <div className="related-links">{related.map(entry => <Link key={entry.code} href={`${psaCatalogPath}${entry.code.toLowerCase()}/`}><span><b>{entry.code}</b> · {entry.subject}</span><ChevronRight size={17} aria-hidden="true" /></Link>)}</div>
          </section>}
          <Link className="work-button-secondary" href={psaCatalogPath}><ClipboardCheck size={17} aria-hidden="true" /> Все коды Peugeot и Citroën</Link>
        </aside>
      </div>
    </div>
  );
}
