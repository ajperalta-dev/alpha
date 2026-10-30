import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../../context/language';
import { BrandLockup } from './BrandLockup';
import { SiteInfo } from './SiteInfo';
export function Footer() {
  const { t, lang } = useLanguage();
  const [showInfo, setShowInfo] = useState(false);
  const [year] = useState(() => new Date().getFullYear());
  const es = lang === 'es';
  return <footer className="site-footer"><div className="shell">
    <div className="footer-main">
      <div className="footer-brand"><a href="#hero" aria-label={es ? 'Volver al inicio' : 'Back to top'}><BrandLockup size="footer" /></a><p>{es ? 'Datos, inteligencia artificial e ingeniería industrial. Diseñamos el cambio. Construimos la transformación.' : 'Data, artificial intelligence and industrial engineering. Designing change. Building transformation.'}</p></div>
      <nav aria-label={es ? 'Enlaces del pie de página' : 'Footer navigation'}><a href="#services">{t('nav.services')}</a><a href="#cases">{t('nav.cases')}</a><a href="#methodology">{t('nav.methodology')}</a><a href="#faq">{es ? 'Preguntas frecuentes' : 'FAQs'}</a></nav>
      <div className="footer-contact"><a href="mailto:alpha.digital.ia@gmail.com">alpha.digital.ia@gmail.com<ArrowUpRight size={15} /></a><a href="tel:+34641012046">+34 641 012 046</a><p>{es ? 'Madrid, España. Trabajamos en remoto.' : 'Madrid, Spain. Working remotely.'}</p></div>
    </div>
    <div className="footer-bottom"><p>© {year} ALPHA Digital Transformation</p><button className="text-link" onClick={() => setShowInfo(true)}>{es ? 'Información y privacidad' : 'Information & privacy'}</button><a className="text-link" href="#hero">{es ? 'Volver arriba' : 'Back to top'}<ArrowUpRight size={15} /></a></div>
  </div>{showInfo && <SiteInfo onClose={() => setShowInfo(false)} />}</footer>;
}
