"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { PsaCode } from "@/data/psa-codes";

const pageSize = 24;

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("ru").replaceAll("ё", "е");
}

export function PsaCatalog({ items }: { items: PsaCode[] }) {
  const [query, setQuery] = useState("");
  const [system, setSystem] = useState("");
  const [page, setPage] = useState(1);
  const systems = [...new Set(items.map(item => item.system))].sort((a, b) => a.localeCompare(b, "ru"));

  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("q");
    if (initial) setQuery(initial);
  }, []);

  const search = normalize(query);
  const lookalikeCode = /^[рpуu][a-f0-9]{1,4}$/i.test(search)
    ? search.replace(/^р/, "p").replace(/^у/, "u")
    : search;
  const words = lookalikeCode.split(/\s+/).filter(Boolean);
  const matches = items.filter(item => {
    if (system && item.system !== system) return false;
    const haystack = normalize([item.code, item.subject, item.detail, item.system].join(" "));
    return words.every(word => haystack.includes(word));
  });
  const totalPages = Math.max(1, Math.ceil(matches.length / pageSize));
  const shown = matches.slice((page - 1) * pageSize, page * pageSize);
  return (
    <section aria-label="Фильтры и коды Peugeot и Citroën">
      <div className="work-toolbar psa-toolbar">
        <label className="work-input-wrap">
          <Search size={19} aria-hidden="true" />
          <input type="search" value={query} aria-label="Код или описание" placeholder="Код или описание, например P1351"
            onChange={event => { setQuery(event.target.value); setPage(1); }} />
        </label>
        <select className="work-select" aria-label="Система автомобиля" value={system}
          onChange={event => { setSystem(event.target.value); setPage(1); }}>
          <option value="">Все системы</option>
          {systems.map(name => <option key={name}>{name}</option>)}
        </select>
      </div>
      <p id="psa-results" className="psa-count" role="status">Найдено: {matches.length} из {items.length}</p>
      {shown.length ? (
        <div className="psa-list">
          {shown.map(item => (
            <Link className="psa-row" key={item.code} href={`/codes/peugeot-citroen/${item.code.toLowerCase()}/`} prefetch={false}>
              <span className="psa-code">{item.code}</span>
              <span className="psa-row-text"><strong>{item.subject}</strong><span>{item.detail}</span></span>
              <span className="psa-row-system">{item.system}</span>
              <ChevronRight aria-hidden="true" size={18} />
            </Link>
          ))}
        </div>
      ) : <p className="work-empty work-panel">Подходящих кодов нет. Попробуйте изменить запрос или выбрать «Все системы».</p>}
      {totalPages > 1 && (
        <nav className="pagination psa-pagination" aria-label="Страницы каталога">
          <button className="work-button-secondary" type="button" disabled={page === 1} onClick={() => setPage(page - 1)}>
            <ChevronLeft aria-hidden="true" size={16} /> Назад
          </button>
          <span>Страница {page} из {totalPages}</span>
          <button className="work-button-secondary" type="button" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            Далее <ChevronRight aria-hidden="true" size={16} />
          </button>
        </nav>
      )}
    </section>
  );
}
