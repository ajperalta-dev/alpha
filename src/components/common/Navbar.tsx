import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react';
import { useLanguage } from '../../context/language';
import { useTheme } from '../../context/theme';
import { BrandLockup } from './BrandLockup';
export function Navbar({ onOpenBooking }: { onOpenBooking: () => void }) {
  const { lang, setLang, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let previousY = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      if (open || currentY <= 80) {
        setHidden(false);
        previousY = currentY;
        return;
      }
      const difference = currentY - previousY;
      if (Math.abs(difference) < 8) return;
      setHidden(difference > 0);
      previousY = currentY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);
  const links = [['#services', 'nav.services'], ['#cases', 'nav.cases'], ['#methodology', 'nav.methodology'], ['#contact', 'nav.contact']];
  return <header className={`site-header${hidden && !open ? ' is-hidden' : ''}`} data-intro-reveal="nav">
    <div className="shell nav-row">
      <a href="#hero" className="brand-home" aria-label={lang === 'es' ? 'ALPHA, inicio' : 'ALPHA, home'} onClick={() => setOpen(false)}><BrandLockup /></a>
      <nav className="desktop-nav" aria-label={lang === 'es' ? 'Navegación principal' : 'Main navigation'}>{links.map(([href, key]) => <a key={href} href={href}>{t(key)}</a>)}</nav>
      <div className="nav-actions">
        <button className="language-toggle" onClick={() => setLang(lang === 'es' ? 'en' : 'es')} aria-label={lang === 'es' ? 'Change language to English' : 'Cambiar idioma a español'}>{lang.toUpperCase()}</button>
        <button className="icon-button theme-toggle" onClick={toggleTheme} aria-label={isDark ? (lang === 'es' ? 'Usar tema claro' : 'Use light theme') : (lang === 'es' ? 'Usar tema oscuro' : 'Use dark theme')}>{isDark ? <Sun size={18} /> : <Moon size={18} />}</button>
        <button className="button button-primary nav-book" onClick={onOpenBooking}>{t('nav.bookCta')}<ArrowUpRight size={17} /></button>
        <button className="icon-button mobile-toggle" aria-expanded={open} aria-controls="mobile-navigation" aria-label={lang === 'es' ? (open ? 'Cerrar menú' : 'Abrir menú') : (open ? 'Close menu' : 'Open menu')} onClick={() => setOpen(!open)}>{open ? <X size={23} /> : <Menu size={23} />}</button>
      </div>
    </div>
    {open && <nav id="mobile-navigation" className="mobile-nav shell" aria-label={lang === 'es' ? 'Navegación móvil' : 'Mobile navigation'}>
      {links.map(([href, key]) => <a href={href} key={href} onClick={() => setOpen(false)}>{t(key)}<ArrowUpRight size={20} /></a>)}
      <button className="button button-primary" onClick={() => { setOpen(false); onOpenBooking(); }}>{t('nav.bookCta')}<ArrowUpRight size={18} /></button>
    </nav>}
  </header>;
}
