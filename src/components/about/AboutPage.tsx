import { useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../../context/language';

export function AboutPage({ onOpenBooking }: { onOpenBooking: () => void }) {
  const { lang } = useLanguage();
  const es = lang === 'es';
  useEffect(() => {
    const previous = document.title;
    document.title = es ? 'Nosotros | Agustín Peralta · ALPHA' : 'About | Agustín Peralta · ALPHA';
    return () => { document.title = previous; };
  }, [es]);

  return <article className="about-page shell">
    <a className="text-link" href="/">{es ? 'Volver al inicio' : 'Back to home'}</a>
    <div className="about-profile">
      <figure className="about-portrait">
        <img src="/brand/agustin-peralta.png" alt="Agustín Peralta" width="240" height="427" />
        <figcaption>ALPHA · {es ? 'Dirección y consultoría' : 'Leadership & consulting'}</figcaption>
      </figure>
      <div className="about-copy">
        <p className="about-label">{es ? 'Nosotros' : 'About us'}</p>
        <h1>Agustín Peralta</h1>
        <p className="about-role">{es ? 'Fundador & Consultor Principal' : 'Founder & Lead Partner'}</p>
        {es && <p className="about-partner">Lead Partner</p>}
        <p className="about-bio">{es
          ? 'Ingeniero Industrial y Máster en Big Data e Inteligencia Artificial por la Universidad de Málaga, con experiencia en la intersección entre operaciones, proyectos industriales, ingeniería de datos e inteligencia artificial aplicada.'
          : 'Industrial Engineer with a Master’s in Big Data and Artificial Intelligence from the University of Málaga, experienced at the intersection of operations, industrial projects, data engineering, and applied artificial intelligence.'}</p>
        <p className="about-bio">{es
          ? 'Experiencia en datos y analítica en Repsol, soluciones de Data & AI para fabricación en TDK Electronics, dirección de operaciones en Pan American Energy e ingeniería de mantenimiento en Lafarge-Holcim.'
          : 'Experience in data and analytics at Repsol, Data & AI solutions for manufacturing at TDK Electronics, operations leadership at Pan American Energy, and maintenance engineering at Lafarge-Holcim.'}</p>
        <div className="about-actions">
          <button className="button button-primary" onClick={onOpenBooking}>{es ? 'Contactar con Agustín' : 'Contact Agustín'}<ArrowUpRight size={18} /></button>
          <a className="text-link" href="https://cv-agustinperalta.netlify.app/" target="_blank" rel="noopener noreferrer">{es ? 'Ver trayectoria completa' : 'View full experience'}<ArrowUpRight size={17} /></a>
        </div>
      </div>
    </div>
    <section className="about-approach" aria-labelledby="about-approach-title">
      <h2 id="about-approach-title">{es ? 'Dirección cercana, capacidad para escalar' : 'Direct leadership, room to scale'}</h2>
      <p>{es
        ? 'En ALPHA, acompaño cada proyecto desde la definición estratégica hasta su ejecución. Combinando la visión estratégica y la dirección directa de proyectos con el respaldo de una red especializada de partners técnicos y consultores senior para escalar la ejecución según la complejidad de cada desafío.'
        : 'At ALPHA, I guide every project from strategic definition through execution. I combine strategic vision and direct project leadership with the support of a specialized network of technical partners and senior consultants, scaling execution to match the complexity of each challenge.'}</p>
    </section>
  </article>;
}
