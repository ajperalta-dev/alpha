import { SceneBackdrop, SceneHeading } from '../common/SceneElements';
import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useLanguage } from '../../context/language';
import { PhaseAnimation } from './PhaseAnimation';

export function MethodologySection() {
  const { t, lang } = useLanguage();
  const es = lang === 'es';
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const names = es ? ['Comprender', 'Validar', 'Construir', 'Evolucionar'] : ['Understand', 'Validate', 'Build', 'Evolve'];
  const questions = es ? ['¿Qué merece la pena resolver?', '¿Funciona con tus datos?', '¿Cómo lo llevamos a producción?', '¿Cómo sigue aportando valor?'] : ['What is worth solving?', 'Does it work with your data?', 'How do we move it into production?', 'How does it keep delivering value?'];
  const times = es ? ['Semanas 1–2', 'Semanas 3–5', 'Semanas 6–10', 'Mejora continua'] : ['Weeks 1–2', 'Weeks 3–5', 'Weeks 6–10', 'Continuous improvement'];
  const deliverables = es ? ['Informe de viabilidad y matriz de ROI', 'Prototipo funcional con datos reales', 'Despliegue productivo e integración de APIs', 'Monitorización, actualización y formación'] : ['Feasibility report and ROI matrix', 'Functional prototype with real data', 'Production deployment and API integration', 'Monitoring, updates and training'];
  const choose = (index: number, focus = false) => {
    const next = Math.min(3, Math.max(0, index));
    setActive(next);
    if (focus) refs.current[next]?.focus({ preventScroll: true });
  };
  return <section id="methodology" className="section methodology-section"><SceneBackdrop /><div className="shell">
    <div className="section-heading"><SceneHeading>{es ? 'Un proceso claro. Un avance tangible.' : 'A clear process. Tangible progress.'}</SceneHeading><p>{es ? 'De entender el problema a poner la solución en marcha. Cuatro fases, una dirección compartida y un entregable concreto en cada etapa.' : 'From understanding the problem to putting the solution to work. Four phases, one shared direction and a concrete deliverable at every stage.'}</p></div>
    <div className="method-steps" role="group" aria-label={es ? 'Fases del proyecto' : 'Project phases'} onKeyDown={event => {
      const index = refs.current.findIndex(button => button === event.target);
      if (index < 0) return;
      const next = ['ArrowRight', 'ArrowDown'].includes(event.key) ? index + 1 : ['ArrowLeft', 'ArrowUp'].includes(event.key) ? index - 1 : event.key === 'Home' ? 0 : event.key === 'End' ? 3 : null;
      if (next !== null) { event.preventDefault(); choose(next, true); }
    }}>{names.map((name, index) => <button key={name} ref={element => { refs.current[index] = element; }} id={`method-step-${index}`} className="method-step" aria-pressed={active === index} aria-controls="method-detail" onClick={() => choose(index)}><span className="method-number">0{index + 1}</span><span><strong>{name}</strong><small>{times[index]}</small></span></button>)}</div>
    <div id="method-detail" className="method-detail" role="region" aria-labelledby={`method-step-${active}`}>
      <div className="method-copy"><p className="method-phase-name">{t(`method.phase${active + 1}.title`)}</p><h3>{questions[active]}</h3><p>{t(`method.phase${active + 1}.desc`)}</p><div className="method-deliverable"><Check size={22} /><div><small>{es ? 'Al finalizar esta fase' : 'At the end of this phase'}</small><strong>{deliverables[active]}</strong></div></div></div>
      <div className="method-illustration is-playing"><PhaseAnimation key={active} phase={active} lang={lang} /></div>
    </div>
    <div className="method-footer"><p role="status">{es ? `Fase ${active + 1} de 4. Los plazos se adaptan al alcance de tu proyecto.` : `Phase ${active + 1} of 4. Timelines adapt to your project scope.`}</p><div><button className="icon-button" disabled={active === 0} onClick={() => choose(active - 1)} aria-label={es ? 'Fase anterior' : 'Previous phase'}><ArrowLeft size={19} /></button><button className="text-link" disabled={active === 3} onClick={() => choose(active + 1)}>{es ? 'Siguiente fase' : 'Next phase'}<ArrowRight size={19} /></button></div></div>
  </div></section>;
}
