import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUpRight, BrainCircuit, Database, Factory, Pause, Play, Workflow } from 'lucide-react';
import { useLanguage } from '../../context/language';
import { TransformationField } from './TransformationField';

export function Hero({ onOpenBooking }: { onOpenBooking: () => void }) {
  const { lang } = useLanguage();
  const es = lang === 'es';
  const [mode, setMode] = useState(1);
  const [paused, setPaused] = useState(false);
  const [introReady, setIntroReady] = useState(false);
  useEffect(() => {
    const ready = () => setIntroReady(true);
    if (document.querySelector('.alpha-site')?.getAttribute('data-intro-state') === 'complete') ready();
    window.addEventListener('alpha:intro-complete', ready);
    return () => window.removeEventListener('alpha:intro-complete', ready);
  }, []);
  useEffect(() => {
    if (!introReady || paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => {
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setMode(current => (current + 1) % 3);
      }
    }, 3000);
    return () => window.clearInterval(timer);
  }, [mode, paused, introReady]);
  const modes = es ? ['Datos', 'Inteligencia', 'Evolución'] : ['Data', 'Intelligence', 'Evolution'];
  const descriptions = es
    ? ['Información dispersa. Nuevas posibilidades.', 'Conexiones que convierten datos en criterio.', 'Sistemas que aprenden. Negocios que evolucionan.']
    : ['Scattered information. New possibilities.', 'Connections that turn data into insight.', 'Systems that learn. Businesses that evolve.'];
  const disciplines = [
    { Icon: Database, title: es ? 'Ingeniería de datos' : 'Data engineering', detail: es ? 'Conecta tu información' : 'Connect your information' },
    { Icon: BrainCircuit, title: es ? 'Inteligencia artificial' : 'Artificial intelligence', detail: es ? 'Amplía tus capacidades' : 'Expand your capabilities' },
    { Icon: Factory, title: 'Industria 4.0', detail: es ? 'Evoluciona tu operación' : 'Evolve your operations' },
    { Icon: Workflow, title: es ? 'Transformación digital' : 'Digital transformation', detail: es ? 'Rediseña lo que es posible' : 'Redesign what is possible' },
  ];
  return <section id="hero" className="hero-section">
    <TransformationField mode={mode} paused={paused || !introReady} />
    <div className="hero-atmosphere" aria-hidden="true" />
    <div className="shell hero-layout">
      <div className="hero-copy">
        <p className="hero-intro hero-brand-line" data-intro-reveal="eyebrow"><span aria-hidden="true" />{es ? 'Transformación Digital · Consultoría' : 'Digital Transformation · Consulting'}</p>
        <h1>{(es ? ['INGENIERÍA DEL DATO', 'PARA DAR EL SIGUIENTE PASO'] : ['DATA ENGINEERING', 'TO TAKE THE NEXT STEP']).map(line => <span className="hero-line-mask" key={line}><span data-intro-line>{line}</span></span>)}</h1>
        <p className="hero-description" data-intro-reveal="subtitle">{es ? 'Conectamos datos, inteligencia artificial e ingeniería industrial para transformar cómo decides, cómo trabajas y hasta dónde puede llegar tu negocio.' : 'We connect data, artificial intelligence and industrial engineering to transform how you decide, how you work and how far your business can go.'}</p>
        <div className="hero-actions" data-intro-reveal="cta">
          <button className="button button-primary" onClick={onOpenBooking}>{es ? 'Empezar transformación digital' : 'Start digital transformation'}<ArrowUpRight size={19} /></button>
          <a className="text-link" href="#services">{es ? 'Explorar soluciones' : 'Explore solutions'}<ArrowDown size={17} /></a>
        </div>
        <p className="hero-reassurance" data-intro-reveal="details">{es ? 'Estrategia, desarrollo e implementación. A tu lado en cada etapa.' : 'Strategy, development and implementation. With you at every stage.'}</p>
      </div>
      <div className="transformation-stage">
        <div className="transformation-signature"><img src="/brand/identity-alpha/alpha-isotipo-oscuro.svg" alt="" width="40" height="40" data-intro-destination /><span data-intro-reveal="details">{es ? 'El cambio toma forma.' : 'Change takes shape.'}</span></div>
        <div className="transformation-controls" data-intro-reveal="details">
          <p className="transformation-description" aria-live="polite">{descriptions[mode]}</p>
          <div className="transformation-control-row">
            <div className="transformation-modes" role="group" aria-label={es ? 'Explorar la transformación de los datos' : 'Explore data transformation'}>{modes.map((name, index) => <button key={name} aria-pressed={mode === index} onClick={() => setMode(index)}>{name}</button>)}</div>
            <button className="icon-button" aria-pressed={paused} aria-label={es ? (paused ? 'Reanudar fondo animado' : 'Pausar fondo animado') : (paused ? 'Resume animated background' : 'Pause animated background')} onClick={() => setPaused(!paused)}>{paused ? <Play size={14} /> : <Pause size={14} />}</button>
          </div>
        </div>
      </div>
    </div>
    <a className="hero-scroll-cue" href="#services" aria-label={es ? 'Descubrir soluciones' : 'Discover solutions'}><span>{es ? 'Descubre' : 'Discover'}</span><span className="hero-scroll-line" aria-hidden="true" /></a>
    <div className="shell hero-disciplines" data-intro-reveal="details">{disciplines.map(({ Icon, title, detail }) => <a href="#services" key={title}><Icon size={23} strokeWidth={1.4} /><span><strong>{title}</strong><small>{detail}</small></span><ArrowUpRight size={15} /></a>)}</div>
  </section>;
}
