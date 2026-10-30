import { SceneBackdrop, SceneHeading } from '../common/SceneElements';
import { useState } from 'react';
import { ArrowUpRight, Boxes, Factory, ChartNoAxesCombined } from 'lucide-react';
import { useLanguage } from '../../context/language';
import { CaseVisual } from './CaseVisual';

export function CaseStudiesSection({ onOpenBooking }: { onOpenBooking: () => void }) {
  const { lang, caseStudies } = useLanguage();
  const [active, setActive] = useState(0);
  const es = lang === 'es';
  const tabs = es ? ['Industria conectada', 'Demanda e inventario', 'Visión de negocio'] : ['Connected industry', 'Demand & inventory', 'Business insight'];
  const titles = es
    ? ['Detectar la señal antes de que llegue la avería.', 'Anticipar la demanda. Coordinar la operación.', 'Una visión del negocio. Decisiones conectadas.']
    : ['Detect the signal before the failure.', 'Anticipate demand. Coordinate operations.', 'One view of the business. Connected decisions.'];
  const outcomes = es
    ? [['Sensores conectados', 'Detección de anomalías', 'Mantenimiento predictivo'], ['Previsión de demanda', 'Planificación de stock', 'Decisiones coordinadas'], ['Datos integrados', 'Indicadores compartidos', 'Informes automatizados']]
    : [['Connected sensors', 'Anomaly detection', 'Predictive maintenance'], ['Demand forecasting', 'Stock planning', 'Coordinated decisions'], ['Integrated data', 'Shared indicators', 'Automated reporting']];
  const icons = [Factory, Boxes, ChartNoAxesCombined];
  const study = caseStudies[active];
  return <section id="cases" className="section cases-section inverse"><SceneBackdrop /><div className="shell">
    <div className="section-heading"><SceneHeading>{es ? 'De la información a una operación inteligente.' : 'From information to intelligent operations.'}</SceneHeading><p>{es ? 'Anticipar fallos. Equilibrar inventarios. Ver el negocio completo. Explora estos escenarios ilustrativos de lo que los datos y la IA pueden aportar a tu organización.' : 'Anticipate failures. Balance inventory. See the whole business. Explore these illustrative scenarios of what data and AI can bring to your organization.'}</p></div>
    <div className="case-selector" role="group" aria-label={es ? 'Explorar casos de uso' : 'Explore use cases'}>{tabs.map((label, index) => {
      const Icon = icons[index];
      return <button id={`case-tab-${index}`} key={label} aria-pressed={active === index} aria-controls="case-showcase" onClick={() => setActive(index)}><Icon size={20} strokeWidth={1.5} />{label}<ArrowUpRight size={16} /></button>;
    })}</div>
    <div id="case-showcase" className="case-showcase" role="region" aria-labelledby={`case-tab-${active}`}>
      <div className="case-showcase-art"><CaseVisual key={active} kind={active} lang={lang} /><div className="case-outcomes">{outcomes[active].map(label => <span key={label}>{label}</span>)}</div><p className="case-art-note">{es ? 'De una señal a una decisión.' : 'From a signal to a decision.'}</p></div>
      <article className="case-showcase-copy"><p className="case-industry">{study.clientIndustry[lang]}</p><h3>{titles[active]}</h3><div className="case-narrative"><h4>{es ? 'El punto de partida' : 'The starting point'}</h4><p>{study.challenge[lang]}</p><h4>{es ? 'La transformación' : 'The transformation'}</h4><p>{study.solution[lang]}</p></div><div className="tag-list">{study.techUsed.map(tech => <span key={tech}>{tech}</span>)}</div></article>
    </div>
    <div className="case-invitation"><h3>{es ? '¿Qué cambiaría en tu negocio?' : 'What would change in your business?'}</h3><button className="button button-primary" onClick={onOpenBooking}>{es ? 'Exploremos tu caso' : 'Let’s explore your use case'}<ArrowUpRight size={18} /></button></div>
  </div></section>;
}
