import { SceneBackdrop, SceneHeading } from '../common/SceneElements';
import { useState, type FormEvent } from 'react';
import { ArrowUpRight, Check, Clock, Copy, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/language';

export function ContactSection() {
  const { lang, services, t } = useLanguage();
  const es = lang === 'es';
  const [copied, setCopied] = useState('');
  const [prepared, setPrepared] = useState(false);
  const [form, setForm] = useState({ name:'', email:'', phone:'', company:'', service:'', message:'' });
  const update = (key: keyof typeof form, value: string) => setForm(previous => ({ ...previous, [key]: value }));
  const copy = async (value: string) => {
    try { await navigator.clipboard.writeText(value); setCopied(value); setTimeout(() => setCopied(''), 2000); } catch { /* The direct contact link remains available. */ }
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const service = services.find(item => item.id === form.service)?.title[lang] || (es ? 'Consulta ALPHA' : 'ALPHA inquiry');
    const body = `${form.name} <${form.email}>\n${form.company} ${form.phone}\n${form.message}`;
    window.location.href = `mailto:alpha.digital.ia@gmail.com?subject=${encodeURIComponent(service)}&body=${encodeURIComponent(body)}`;
    setPrepared(true);
  };
  return <section id="contact" className="section contact-section inverse"><SceneBackdrop /><div className="shell contact-layout">
    <div className="contact-intro"><SceneHeading>{es ? 'Tu próxima evolución empieza aquí.' : 'Your next evolution starts here.'}</SceneHeading><p>{es ? 'Un proceso que necesita cambiar. Datos que todavía no conectan. Una idea de IA que quieres llevar a la práctica. Cuéntanos tu reto y diseñemos el primer paso.' : 'A process that needs to change. Data that isn’t connected yet. An AI idea you want to put into practice. Tell us your challenge and let’s design the first step.'}</p>
      <div className="contact-channel"><Mail /><div><small>{es ? 'Escríbenos' : 'Email us'}</small><a href="mailto:alpha.digital.ia@gmail.com">alpha.digital.ia@gmail.com</a></div><button className="icon-button" onClick={() => copy('alpha.digital.ia@gmail.com')} aria-label={es ? 'Copiar correo electrónico' : 'Copy email address'}>{copied === 'alpha.digital.ia@gmail.com' ? <Check size={15} /> : <Copy size={15} />}</button></div>
      <div className="contact-channel"><Phone /><div><small>{es ? 'Llámanos' : 'Call us'}</small><a href="tel:+34641012046">+34 641 012 046</a></div><button className="icon-button" onClick={() => copy('+34641012046')} aria-label={es ? 'Copiar teléfono' : 'Copy phone number'}>{copied === '+34641012046' ? <Check size={15} /> : <Copy size={15} />}</button></div>
      <span className="sr-only" role="status">{copied ? (es ? 'Copiado al portapapeles' : 'Copied to clipboard') : ''}</span>
      <div className="contact-availability"><p><MapPin size={15} />{es ? 'Madrid · En remoto' : 'Madrid · Remote'}</p><p><Clock size={15} />{t('contact.info.hours')}</p></div>
      <p className="confidentiality-note"><ShieldCheck size={17} /><span>{es ? 'Tu información se trata con confidencialidad. Podemos acordar un NDA antes de compartir datos del proyecto.' : 'Your information is treated confidentially. We can agree on an NDA before sharing project data.'}</span></p>
    </div>
    <div className="contact-form-panel">
      {!prepared ? <><h3 className="form-heading">{es ? '¿Qué tienes en mente?' : 'What do you have in mind?'}</h3><p className="form-intro">{es ? 'Déjanos un poco de contexto para empezar.' : 'Give us a little context to get started.'}</p><form className="form-stack" onSubmit={submit}>
        <div className="form-row"><div className="field"><label htmlFor="contact-name">{es ? 'Nombre *' : 'Name *'}</label><input id="contact-name" name="name" autoComplete="name" required value={form.name} onChange={event => update('name', event.target.value)} placeholder={es ? 'Tu nombre' : 'Your name'} /></div><div className="field"><label htmlFor="contact-email">{es ? 'Correo electrónico *' : 'Email address *'}</label><input id="contact-email" name="email" type="email" autoComplete="email" required value={form.email} onChange={event => update('email', event.target.value)} placeholder={es ? 'tu@empresa.com' : 'you@company.com'} /></div></div>
        <div className="form-row"><div className="field"><label htmlFor="contact-company">{es ? 'Empresa' : 'Company'}</label><input id="contact-company" autoComplete="organization" value={form.company} onChange={event => update('company', event.target.value)} placeholder={es ? 'Si nos contactas como empresa' : 'If you’re contacting us as a company'} /></div><div className="field"><label htmlFor="contact-phone">{es ? 'Teléfono' : 'Phone'}</label><input id="contact-phone" type="tel" autoComplete="tel" value={form.phone} onChange={event => update('phone', event.target.value)} placeholder="+34 600 000 000" /></div></div>
        <div className="field"><label htmlFor="contact-service">{es ? '¿En qué podemos ayudarte?' : 'How can we help?'}</label><select id="contact-service" value={form.service} onChange={event => update('service', event.target.value)}><option value="">{es ? 'Ayúdame a encontrar mi punto de partida' : 'Help me find my starting point'}</option>{services.map(service => <option key={service.id} value={service.id}>{service.title[lang]}</option>)}</select></div>
        <div className="field"><label htmlFor="contact-message">{es ? 'Tu idea o tu reto *' : 'Your idea or challenge *'}</label><textarea id="contact-message" required rows={4} value={form.message} onChange={event => update('message', event.target.value)} placeholder={es ? 'Qué quieres conseguir, dónde estás ahora y qué necesitas resolver.' : 'What you want to achieve, where you are now and what you need to solve.'} /></div>
        <button className="button button-primary form-submit" type="submit">{es ? 'Preparar correo' : 'Prepare email'}<ArrowUpRight size={18} /></button><p className="form-footnote">{es ? '* Campos obligatorios. Se abrirá tu aplicación de correo con el mensaje preparado para que lo envíes.' : '* Required fields. Your email app will open with the message ready for you to send.'}</p>
      </form></> : <div className="success-state" role="status"><span className="success-symbol"><Check size={30} /></span><h3>{es ? 'Tu correo está preparado.' : 'Your email is ready.'}</h3><p>{es ? 'Completa el envío en tu aplicación de correo. Si no se ha abierto, escríbenos directamente a alpha.digital.ia@gmail.com.' : 'Complete sending in your email app. If it did not open, email us directly at alpha.digital.ia@gmail.com.'}</p><button className="button button-outline" onClick={() => setPrepared(false)}>{es ? 'Volver a mi consulta' : 'Back to my inquiry'}</button></div>}
    </div>
  </div></section>;
}
