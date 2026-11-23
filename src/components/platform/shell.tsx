"use client";

import { useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, LogIn, Menu, Search, X } from "lucide-react";
import { useWorkspace } from "@/platform/store";

const mainLinks = [
  { href: "/codes/", label: "Коды ошибок" },
  { href: "/symptoms/", label: "Симптомы" },
  { href: "/algorithms/", label: "Алгоритмы" },
  { href: "/checks/", label: "Проверки" },
  { href: "/knowledge/", label: "База знаний" },
];

const footerLinks = [
  { title: "Справочник", links: [
    mainLinks[0], { href: "/codes/peugeot-citroen/", label: "Peugeot и Citroën" }, mainLinks[1],
    { href: "/dashboard/", label: "Индикаторы панели" },
  ] },
  { title: "Материалы", links: [
    mainLinks[2], mainLinks[3], mainLinks[4], { href: "/cases/", label: "Практические случаи" },
    { href: "/guides/", label: "Инструкции" },
  ] },
  { title: "DiagDoc", links: [
    { href: "/editor/", label: "Редактор алгоритмов" }, { href: "/diagnosis/", label: "Диагностика" },
    { href: "/about/", label: "О проекте" }, { href: "/privacy/", label: "Конфиденциальность" },
  ] },
];

function Brand() {
  return (
    <Link href="/" className="brand site-brand" aria-label="DiagDoc — главная">
      <span className="brand-mark"><Activity size={22} strokeWidth={2.5} aria-hidden="true" /></span>
      <span>Diag<span className="brand-orange">Doc</span></span>
    </Link>
  );
}

export function PlatformShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, ready } = useWorkspace();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const menuOpen = menuPath === pathname;
  const profileName = ready && user ? user.name : "Войти в демо";

  function isActive(href: string) {
    if (href === "/codes/") return pathname.startsWith(href) || pathname.startsWith("/references/dtc/");
    if (href === "/symptoms/") return pathname.startsWith(href) || pathname.startsWith("/references/symptom/");
    return pathname.startsWith(href);
  }

  return (
    <div className="app-frame">
      <a href="#main-content" className="site-skip">К содержанию</a>
      <header className="site-header" onKeyDown={event => {
        if (event.key === "Escape" && menuOpen) {
          setMenuPath(null);
          menuButton.current?.focus();
        }
      }}>
        <div className="site-container site-header-inner">
          <Brand />
          <div className="site-header-actions">
            <Link href="/search/" className="site-header-search" aria-label="Поиск по сайту">
              <Search size={18} aria-hidden="true" /><span>Поиск</span>
            </Link>
            <Link href="/settings/" className="site-header-profile" aria-label={user ? `Профиль: ${profileName}` : profileName}>
              {user ? <span aria-hidden="true" className="site-avatar">{user.name.slice(0, 1)}</span> : <LogIn size={18} aria-hidden="true" />}
              <span className="site-profile-label">{profileName}</span>
            </Link>
            <button ref={menuButton} type="button" className="site-menu-toggle" aria-controls="site-navigation" aria-expanded={menuOpen}
              aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"} onClick={() => setMenuPath(menuOpen ? null : pathname)}>
              {menuOpen ? <X size={23} aria-hidden="true" /> : <Menu size={23} aria-hidden="true" />}
            </button>
          </div>
          <nav id="site-navigation" aria-label="Основное меню" className={`site-nav${menuOpen ? " is-open" : ""}`}>
            {mainLinks.map(({ href, label }) => (
              <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}
                className={isActive(href) ? "active" : undefined} onClick={() => setMenuPath(null)}>{label}</Link>
            ))}
          </nav>
        </div>
      </header>
      <main id="main-content" className="app-content">{children}</main>
      <footer className="site-footer">
        <div className="site-container">
          <div className="site-footer-grid">
            <div className="site-footer-intro">
              <Brand />
              <p>Справочник автомобильной диагностики. От кода ошибки и симптома к обоснованной проверке.</p>
            </div>
            {footerLinks.map(group => (
              <nav key={group.title} aria-label={group.title + " — подвал"} className="site-footer-links">
                <h2>{group.title}</h2>
                {group.links.map(({ href, label }) => <Link key={href} href={href}>{label}</Link>)}
              </nav>
            ))}
          </div>
          <div className="site-footer-bottom">
            <span>© {new Date().getFullYear()} DiagDoc</span>
            <span>Черновики редактора хранятся в браузере.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
