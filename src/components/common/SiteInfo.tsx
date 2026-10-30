import { X } from 'lucide-react';
import { useLanguage } from '../../context/language';
import { useDialog } from '../../hooks/useDialog';
export function SiteInfo({ onClose }: { onClose: () => void }) {
  const { lang } = useLanguage();
  const ref = useDialog(true, onClose);
  const es = lang === 'es';
  return <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}><div ref={ref} role="dialog" aria-modal="true" aria-labelledby="site-info-title" className="dialog">
    <button className="icon-button dialog-close" onClick={onClose} aria-label={es ? 'Cerrar información' : 'Close information'}><X size={22} /></button>
    <p className="dialog-kicker">ALPHA</p><h2 id="site-info-title">{es ? 'Información y privacidad' : 'Information & privacy'}</h2>
    <div className="site-info-copy">
      <p>{es ? 'Esta web guarda tu idioma y tema en el almacenamiento local del navegador. El asistente utiliza el proveedor configurado en el servidor y no conserva la conversación entre recargas.' : 'This website saves your language and theme in browser local storage. The assistant uses the provider configured on the server and does not retain conversations between reloads.'}</p>
      <p>{es ? 'El formulario de contacto prepara un mensaje en tu aplicación de correo. El envío lo completas tú. Cuando la agenda está conectada, el formulario de reserva comprueba disponibilidad y envía una invitación de Google Calendar al correo indicado.' : 'The contact form prepares a message in your email app. You complete the sending. When the calendar is connected, the booking form checks availability and sends a Google Calendar invitation to the supplied email address.'}</p>
      <p>{es ? 'WhatsApp y Google Calendar son servicios externos. Las tipografías de esta web se cargan desde Google Fonts.' : 'WhatsApp and Google Calendar are external services. This website loads typefaces from Google Fonts.'}</p>
      <p>{es ? 'Puedes contactar con nosotros en ' : 'You can contact us at '}<a href="mailto:alpha.digital.ia@gmail.com">alpha.digital.ia@gmail.com</a>.</p>
    </div>
  </div></div>;
}
