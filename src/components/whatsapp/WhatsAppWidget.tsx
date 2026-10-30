import { useLanguage } from '../../context/language';
export function WhatsAppWidget() {
  const { lang } = useLanguage();
  const es = lang === 'es';
  const text = encodeURIComponent(es ? 'Hola ALPHA, me gustaría hablar sobre un proyecto de datos o inteligencia artificial.' : 'Hello ALPHA, I’d like to discuss a data or artificial intelligence project.');
  return <a className="widget-launcher whatsapp-launcher" href={`https://wa.me/34641012046?text=${text}`} target="_blank" rel="noopener noreferrer" aria-label={es ? 'Contactar por WhatsApp' : 'Contact us on WhatsApp'}>
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.661 1.435 5.178L2 22l4.981-1.309A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2a8.16 8.16 0 0 1-4.321-1.229l-.31-.184-2.96.777.79-2.887-.202-.321A8.17 8.17 0 0 1 3.8 12c0-4.521 3.679-8.2 8.2-8.2s8.2 3.679 8.2 8.2-3.679 8.2-8.2 8.2z" /><path d="M16.4 14.1c-.2-.1-1.2-.6-1.4-.6-.2-.1-.3-.1-.4.1l-.7.8c-.1.1-.2.2-.4.1-.2-.1-.9-.3-1.7-1-.6-.5-1-1.2-1.2-1.4-.1-.2 0-.3.1-.4l.4-.5c.1-.1.1-.2.1-.4l-.6-1.5c-.1-.3-.3-.3-.4-.3h-.4c-.2 0-.4.1-.5.2-.5.5-.8 1.1-.8 1.8 0 1 .7 2 1.4 2.8.8.9 1.8 1.6 3 2 .8.3 1.5.5 2.2.3.6-.2 1.1-.7 1.2-1.2.1-.3.1-.6 0-.7-.1-.1-.2-.1-.4-.2z" /></svg><span>WhatsApp</span>
  </a>;
}
