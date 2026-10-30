import { SceneBackdrop, SceneHeading } from '../common/SceneElements';
import { useState } from 'react';
import { ArrowUpRight, BarChart3, Check, Compass, Cpu, Database, Factory, GraduationCap, Layers, Search, Server, Sparkles, X, type LucideIcon } from 'lucide-react';
import { useLanguage } from '../../context/language';
import { useDialog } from '../../hooks/useDialog';
import type { ServiceItem } from '../../types';
import { servicePresentation } from './servicePresentation';
import { ServiceAnimation } from './ServiceAnimation';

const icons: Record<string, LucideIcon> = { BarChart3, Compass, Cpu, Database, Factory, GraduationCap, Layers, Server, Sparkles };
type Filter = 'all' | 'foundational' | 'advanced' | 'industrial' | 'advisory';
export function ServicesSection({ onSelectServiceForBooking }: { onSelectServiceForBooking: (service: string) => void }) {
  const { t, lang, services } = useLanguage();
  const es = lang === 'es';
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ServiceItem | null>(null);
  const ref = useDialog(!!selected, () => setSelected(null));
  const copy = (service: ServiceItem) => servicePresentation[service.id]?.[lang] ?? { title: service.title[lang], category: service.levelBadge[lang], benefit: service.subtitle[lang], explanation: service.description[lang], includes: service.deliverables[lang].slice(0, 2) };
  const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const filtered = services.filter(service => {
    const content = copy(service);
    const matchesSearch = normalize([content.title, content.category, content.benefit, content.explanation, ...content.includes, ...service.techStack].join(' ')).includes(normalize(search.trim()));
    const matchesFilter = filter === 'all' || (filter === 'advisory' && service.level === 0) || (filter === 'foundational' && service.level > 0 && service.level <= 2) || (filter === 'advanced' && service.level >= 3 && service.level <= 4) || (filter === 'industrial' && service.level >= 5);
    return matchesSearch && matchesFilter;
  });
  const filters: [Filter, string][] = [['all', t('services.filter.all')], ['foundational', t('services.filter.foundational')], ['advanced', t('services.filter.advanced')], ['industrial', t('services.filter.industrial')], ['advisory', es ? 'Consultoría y tutorías' : 'Consulting & tutoring']];
  return <section id="services" className="section services-section"><SceneBackdrop /><div className="shell">
    <div className="section-heading"><SceneHeading>{es ? 'Conectamos las piezas de tu transformación.' : 'Connecting the pieces of your transformation.'}</SceneHeading><p>{es ? 'Desde la arquitectura del dato hasta una fábrica conectada. Diseñamos soluciones de analítica, IA y automatización que se integran en tu negocio, con las personas y los procesos en el centro.' : 'From data architecture to a connected factory. We design analytics, AI and automation solutions that integrate into your business, with people and processes at the centre.'}</p></div>
    <div className="service-tools">
      <div className="filter-list" role="group" aria-label={es ? 'Filtrar soluciones' : 'Filter solutions'}>{filters.map(([value, label]) => <button key={value} className="filter-button" aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>)}</div>
      <label className="search-field"><Search size={18} aria-hidden="true" /><span className="sr-only">{es ? 'Buscar soluciones' : 'Search solutions'}</span><input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder={es ? '¿Qué necesitas resolver?' : 'What do you need to solve?'} /></label>
    </div>
    <p className="result-count" role="status">{filtered.length} {es ? 'soluciones para tu siguiente paso' : 'solutions for your next step'}</p>
    <div className="service-grid">{filtered.map(service => {
      const item = copy(service);
      const Icon = icons[service.iconName] ?? Layers;
      return <article key={service.id} className={`service-card ${service.level === 0 ? 'service-card--advisory' : ''}`}>
        <div className="service-media"><ServiceAnimation icon={service.iconName} lang={lang} /><span className="service-media-caption">{service.techStack.slice(0, 3).join(' / ')}</span></div>
        <div className="service-card-content">
        <div className="service-card-top"><span className="service-icon"><Icon size={24} strokeWidth={1.6} /></span><span className="service-category">{item.category}</span></div>
        <h3>{item.title}</h3><p className="service-benefit">{item.benefit}</p>
        <ul className="check-list">{item.includes.map(include => <li key={include}><Check size={16} /><span>{include}</span></li>)}</ul>
        <div className="service-card-actions"><button className="text-link" onClick={() => setSelected(service)}>{es ? 'Explorar la solución' : 'Explore the solution'}<ArrowUpRight size={17} /></button><button className="button button-outline button-small" onClick={() => onSelectServiceForBooking(service.title[lang])}>{es ? 'Hablemos' : 'Let’s talk'}</button></div>
        </div>
      </article>;
    })}</div>
    {filtered.length === 0 && <div className="empty-state"><Search size={28} /><h3>{es ? 'No encontramos esa solución.' : 'No solutions found.'}</h3><p>{es ? 'Prueba con otro objetivo o tecnología.' : 'Try another goal or technology.'}</p><button className="button button-outline" onClick={() => { setSearch(''); setFilter('all'); }}>{es ? 'Ver todas las soluciones' : 'See all solutions'}</button></div>}
    <div className="services-note"><p>{es ? '¿Todavía no sabes por dónde empezar?' : 'Not sure where to start?'}</p><button className="text-link" onClick={() => onSelectServiceForBooking(es ? 'Consultoría estratégica' : 'Strategic consulting')}>{es ? 'Definamos el primer paso juntos' : 'Let’s define your first step together'}<ArrowUpRight size={18} /></button></div>
  </div>
  {selected && <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setSelected(null); }}>
    <div className="dialog service-dialog" role="dialog" aria-modal="true" aria-labelledby="service-dialog-title" ref={ref}>
      <button className="icon-button dialog-close" onClick={() => setSelected(null)} aria-label={es ? 'Cerrar detalles' : 'Close details'}><X size={22} /></button>
      <p className="dialog-kicker">{copy(selected).category}</p><h2 id="service-dialog-title">{copy(selected).title}</h2><p className="dialog-lead">{copy(selected).benefit}</p>
      <div className="service-dialog-visual"><ServiceAnimation icon={selected.iconName} lang={lang} /></div>
      <p>{selected.description[lang]}</p><h3>{es ? 'Lo que construimos contigo' : 'What we build together'}</h3>
      <ul className="check-list">{selected.deliverables[lang].map(item => <li key={item}><Check size={16} /><span>{item}</span></li>)}</ul>
      <div className="dialog-callout"><h3>{es ? 'Para tu negocio' : 'For your business'}</h3><p>{selected.businessImpact[lang]}</p></div>
      <div className="tag-list">{selected.techStack.map(tech => <span key={tech}>{tech}</span>)}</div>
      <button className="button button-primary" onClick={() => { const name = selected.title[lang]; setSelected(null); onSelectServiceForBooking(name); }}>{es ? 'Hablar de esta solución' : 'Discuss this solution'}<ArrowUpRight size={18} /></button>
    </div>
  </div>}
  </section>;
}
