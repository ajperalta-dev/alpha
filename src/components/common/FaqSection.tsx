import { SceneBackdrop, SceneHeading } from './SceneElements';
import { ArrowUpRight, Plus } from 'lucide-react';
import { useLanguage } from '../../context/language';
export function FaqSection() {
  const { lang } = useLanguage();
  const es = lang === 'es';
  const items = es ? [
    ['¿Por dónde empiezo si todavía no tengo claro el proyecto?', 'Empieza por una consultoría. Revisaremos tu situación, tus objetivos y los datos disponibles para definir un alcance y los próximos pasos.'],
    ['¿Las tutorías requieren conocimientos previos?', 'Adaptamos el plan a tu punto de partida. Puedes comenzar con fundamentos de Python, SQL o Power BI, o trabajar sobre un proyecto avanzado de ciencia de datos e IA.'],
    ['¿Trabajáis con profesionales y equipos?', 'Sí. Las tutorías pueden ser individuales o para equipos. La consultoría puede centrarse en una decisión puntual o acompañar el desarrollo de una iniciativa.'],
    ['¿Cómo se confirma una sesión?', 'Completa el formulario de reserva con el servicio, el horario preferido y tu correo. La agenda comprueba la disponibilidad antes de enviar una invitación. Si no se puede confirmar, puedes contactarnos por correo o WhatsApp.'],
    ['¿Cómo se determina el presupuesto?', 'Depende del alcance, la complejidad y la modalidad de trabajo. Definimos contigo los objetivos y entregables antes de preparar una propuesta.'],
  ] : [
    ['Where should I start if my project is not defined yet?', 'Start with a consultation. We review your situation, goals and available data to define a scope and next steps.'],
    ['Do I need prior knowledge for tutoring?', 'We adapt the plan to your starting point. Begin with Python, SQL or Power BI fundamentals, or work on an advanced data science and AI project.'],
    ['Do you work with individuals and teams?', 'Yes. Tutoring is available for individuals and teams. Consulting can focus on a specific decision or support an ongoing initiative.'],
    ['How is a session confirmed?', 'Complete the booking form with the service, preferred time and your email. The calendar checks availability before sending an invitation. If it cannot be confirmed, contact us by email or WhatsApp.'],
    ['How is pricing determined?', 'Pricing depends on scope, complexity and engagement format. We agree on goals and deliverables before preparing a proposal.'],
  ];
  return <section id="faq" className="section faq-section"><SceneBackdrop /><div className="shell faq-layout"><div className="faq-intro"><SceneHeading>{es ? 'Hagamos fácil el primer paso' : 'Let’s make the first step easy'}</SceneHeading><p>{es ? 'Cada proyecto y cada persona parten de un lugar distinto. Estas respuestas te ayudarán a encontrar el tuyo.' : 'Every project and every person starts somewhere different. These answers will help you find your starting point.'}</p><a href="#contact" className="text-link">{es ? '¿Tienes otra pregunta?' : 'Have another question?'}<ArrowUpRight size={17} /></a></div><div className="faq-list">{items.map(([question, answer]) => <details className="faq-item" key={question}><summary>{question}<Plus size={19} aria-hidden="true" /></summary><p>{answer}</p></details>)}</div></div></section>;
}
