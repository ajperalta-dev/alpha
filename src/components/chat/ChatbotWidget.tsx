import { useEffect, useRef, useState } from 'react';
import { AlertCircle, ArrowUpRight, LoaderCircle, Send, X } from 'lucide-react';
import { useLanguage } from '../../context/language';
import { useTheme } from '../../context/theme';

type Message = { id: string; role: 'user' | 'assistant'; content: string };
export function ChatbotWidget({ onOpenBooking }: { onOpenBooking: () => void }) {
  const { lang } = useLanguage();
  const { isDark } = useTheme();
  const es = lang === 'es';
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [configured, setConfigured] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wasOpened = useRef(false);
  const mark = `/brand/identity-alpha/alpha-isotipo-${isDark ? 'oscuro' : 'claro'}.svg`;

  useEffect(() => {
    if (open) { wasOpened.current = true; inputRef.current?.focus(); }
    else if (wasOpened.current) triggerRef.current?.focus();
  }, [open]);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [messages, loading, open]);
  useEffect(() => {
    if (!open || configured !== null) return;
    let active = true;
    fetch('/api/health').then(response => response.json()).then(data => { if (active) setConfigured(Boolean(data.aiConfigured)); }).catch(() => { if (active) setConfigured(false); });
    return () => { active = false; };
  }, [open, configured]);

  const send = async (text = input) => {
    const content = text.trim();
    if (!content || loading) return;
    const conversation: Message[] = [...messages, { id: crypto.randomUUID(), role: 'user', content }];
    setMessages(conversation); setInput(''); setError(''); setLoading(true);
    try {
      const response = await fetch('/api/chat', { method:'POST', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify({ lang, messages:conversation.map(({ role, content }) => ({ role, content })) }) });
      const data = await response.json() as { message?: string; error?: string };
      if (!response.ok || !data.message) throw new Error(data.error || 'Request failed');
      setMessages(previous => [...previous, { id:crypto.randomUUID(), role:'assistant', content:data.message! }]);
    } catch {
      setError(es ? 'El asistente no ha podido responder. Puedes intentarlo de nuevo o solicitar una sesión con nosotros.' : 'The assistant could not respond. Try again or request a session with us.');
    } finally { setLoading(false); inputRef.current?.focus(); }
  };
  const prompts = es ? ['¿Por dónde empiezo?', 'Quiero una tutoría', 'Necesito consultoría'] : ['Where do I start?', 'I want tutoring', 'I need consulting'];
  return <>
    <button ref={triggerRef} hidden={open} className="widget-launcher assistant-launcher" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="alpha-assistant" aria-label={es ? 'Abrir asistente ALPHA' : 'Open ALPHA assistant'}><img src={`/brand/identity-alpha/alpha-isotipo-${isDark ? 'claro' : 'oscuro'}.svg`} alt="" /><span>{es ? 'Asistente ALPHA' : 'ALPHA assistant'}</span></button>
    {open && <section id="alpha-assistant" className="assistant-panel" aria-label={es ? 'Asistente ALPHA' : 'ALPHA assistant'} onKeyDown={event => { if (event.key === 'Escape') setOpen(false); }}>
      <header className="assistant-header"><img src={mark} alt="" /><div><h2>{es ? 'Asistente ALPHA' : 'ALPHA assistant'}</h2><p>{configured === false ? (es ? 'Puedes contactar también con nuestro equipo' : 'You can also contact our team') : (es ? 'Un punto de partida para tus ideas' : 'A starting point for your ideas')}</p></div><button className="icon-button" onClick={() => setOpen(false)} aria-label={es ? 'Cerrar asistente' : 'Close assistant'}><X size={18} /></button></header>
      <div ref={logRef} className="assistant-log" role="log" aria-live="polite" aria-relevant="additions">
        <p className="assistant-intro">{es ? 'Hola. Cuéntame qué quieres conseguir y te ayudaré a encontrar una solución, una consultoría o una tutoría para avanzar.' : 'Hello. Tell me what you want to achieve and I’ll help you find a solution, consultation or tutoring to move forward.'}</p>
        {messages.map(message => <p key={message.id} className={`chat-message ${message.role === 'user' ? 'chat-message--user' : ''}`}>{message.content}</p>)}
        {loading && <p className="assistant-loading"><LoaderCircle size={16} className="spinner" />{es ? 'Preparando una respuesta…' : 'Preparing a response…'}</p>}
        {error && <p className="notice" role="alert"><AlertCircle size={16} />{error}</p>}
      </div>
      {messages.length === 0 && <div className="assistant-prompts">{prompts.map(prompt => <button key={prompt} onClick={() => send(prompt)} disabled={loading}>{prompt}</button>)}</div>}
      <button className="text-link assistant-book" onClick={() => { wasOpened.current = false; setOpen(false); onOpenBooking(); }}>{es ? 'Prefiero hablar con una persona' : 'I’d rather speak to a person'}<ArrowUpRight size={14} /></button>
      <form className="assistant-compose" onSubmit={event => { event.preventDefault(); void send(); }}><input ref={inputRef} value={input} onChange={event => setInput(event.target.value)} maxLength={2000} aria-label={es ? 'Tu pregunta' : 'Your question'} placeholder={es ? 'Escribe tu pregunta…' : 'Type your question…'} /><button className="icon-button" type="submit" disabled={loading || !input.trim()} aria-label={es ? 'Enviar pregunta' : 'Send question'}><Send size={18} /></button></form>
      <p className="assistant-footnote">{es ? 'Conversación temporal con IA. Evita compartir información confidencial y comprueba las respuestas importantes.' : 'Temporary AI conversation. Avoid sharing confidential information and check important answers.'}</p>
    </section>}
  </>;
}
