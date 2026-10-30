import React, { useState } from 'react';
import { AlertCircle, ArrowLeft, ArrowRight, Check, Clock, LoaderCircle, X } from 'lucide-react';
import { useLanguage } from '../../context/language';
import { useTheme } from '../../context/theme';
import type { BookingFormData } from '../../types';
import { useDialog } from '../../hooks/useDialog';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
  initialNotes?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({ 
  isOpen, 
  onClose, 
  preselectedService = '',
  initialNotes = '' 
}) => {
  const { t, lang, services } = useLanguage();
  const { isDark } = useTheme();
  const es = lang === 'es';
  const dialogRef = useDialog(isOpen, onClose);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [minimumDate] = useState(() => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Madrid' }).format(new Date(Date.now() + 86400000)));

  const [formData, setFormData] = useState<BookingFormData>(() => ({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    serviceCategory: preselectedService || services[0].title[lang],
    companySize: 'individual',
    preferredDate: minimumDate,
    preferredTime: '09:30 - 10:00 Europe/Madrid',
    projectDescription: initialNotes || '',
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateStep1 = () => true;

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.preferredDate || formData.preferredDate <= new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Madrid' }).format(new Date())) {
      newErrors.preferredDate = lang === 'es' ? 'Selecciona una fecha válida' : 'Please select a date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = lang === 'es' ? 'El nombre es obligatorio' : 'Name is required';
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = lang === 'es' ? 'Introduce un correo corporativo válido' : 'Valid corporate email required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) { setStep(2); return; }
    if (!validateStep3()) return;

    if (submitting) return;
    setSubmitting(true); setSubmitError('');
    try {
      const response = await fetch('/api/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setIsSubmitted(true);
    } catch (error) {
      const code = error instanceof Error ? error.message : '';
      setSubmitError(['CALENDAR_NOT_CONFIGURED', 'CALENDAR_AUTH_FAILED', 'CALENDAR_WRONG_ACCOUNT'].includes(code)
        ? (lang === 'es' ? 'La agenda todavía no está conectada. Contacta con alpha.digital.ia@gmail.com para reservar.' : 'Calendar is not connected yet. Contact alpha.digital.ia@gmail.com to book.')
        : code === 'SLOT_UNAVAILABLE'
          ? (lang === 'es' ? 'Ese horario está ocupado. Selecciona otro.' : 'This time is already booked. Choose another slot.')
          : (lang === 'es' ? 'No se pudo confirmar el envío. Reintenta con los mismos datos; no se duplicará la invitación.' : 'Could not confirm delivery. Retry with the same details; the invitation will not be duplicated.'));
    } finally { setSubmitting(false); }
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setStep(1);
    setSubmitError('');
    onClose();
  };

  const timeSlots = [
    '09:30 - 10:00 Europe/Madrid',
    '10:30 - 11:00 Europe/Madrid',
    '12:00 - 12:30 Europe/Madrid',
    '15:00 - 15:30 Europe/Madrid',
    '16:30 - 17:00 Europe/Madrid',
    '17:30 - 18:00 Europe/Madrid',
  ];

  const update = (key: keyof BookingFormData, value: string) => setFormData(previous => ({ ...previous, [key]:value }));
  const steps = es ? ['Tu proyecto', 'Fecha y hora', 'Tus datos'] : ['Your project', 'Date & time', 'Your details'];
  return <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget && !submitting) onClose(); }}>
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="booking-title" className="dialog booking-dialog">
      <button className="icon-button dialog-close" onClick={onClose} disabled={submitting} aria-label={es ? 'Cerrar reserva' : 'Close booking'}><X size={21} /></button>
      <div className="booking-brand"><img src={`/brand/identity-alpha/alpha-isotipo-${isDark ? 'oscuro' : 'claro'}.svg`} alt="ALPHA" /></div>
      {!isSubmitted ? <>
        <div className="booking-heading"><h2 id="booking-title">{es ? 'Demos el primer paso' : 'Let’s take the first step'}</h2><p className="dialog-lead">{es ? 'Una sesión inicial gratuita de 30 minutos para conocer tu reto y explorar cómo ayudarte.' : 'A free 30-minute initial session to understand your challenge and explore how we can help.'}</p></div>
        <ol className="booking-progress">{steps.map((label, index) => <li key={label} aria-current={step === index + 1 ? 'step' : undefined}><span>{step > index + 1 ? <Check size={12} /> : index + 1}</span>{label}</li>)}</ol>
        <form onSubmit={event => { if (step < 3) { event.preventDefault(); handleNext(); } else void handleSubmit(event); }} noValidate>
          {step === 1 && <div className="form-stack">
            <div className="field"><label htmlFor="booking-service">{t('booking.field.service')}</label><select id="booking-service" value={formData.serviceCategory} onChange={event => update('serviceCategory', event.target.value)}>{!services.some(service => service.title[lang] === formData.serviceCategory) && <option value={formData.serviceCategory}>{formData.serviceCategory}</option>}{services.map(service => <option key={service.id} value={service.title[lang]}>{service.title[lang]}</option>)}</select></div>
            <div className="field"><label htmlFor="booking-size">{t('booking.field.size')}</label><select id="booking-size" value={formData.companySize} onChange={event => update('companySize', event.target.value)}><option value="individual">{es ? 'Particular o profesional independiente' : 'Individual or independent professional'}</option><option value="1-20">{es ? 'De 1 a 20 personas' : '1 to 20 people'}</option><option value="20-100">{es ? 'De 20 a 100 personas' : '20 to 100 people'}</option><option value="100-500">{es ? 'De 100 a 500 personas' : '100 to 500 people'}</option><option value="500+">{es ? 'Más de 500 personas' : 'More than 500 people'}</option></select></div>
            <div className="field"><label htmlFor="booking-notes">{t('booking.field.notes')}</label><textarea id="booking-notes" rows={3} value={formData.projectDescription} onChange={event => update('projectDescription', event.target.value)} placeholder={es ? 'Qué te gustaría conseguir o qué necesitas resolver.' : 'What you’d like to achieve or what you need to solve.'} /></div>
          </div>}
          {step === 2 && <div className="form-stack">
            <div className="field"><label htmlFor="booking-date">{t('booking.field.date')}</label><input type="date" id="booking-date" value={formData.preferredDate} min={minimumDate} onChange={event => update('preferredDate', event.target.value)} aria-invalid={!!errors.preferredDate} aria-describedby={errors.preferredDate ? 'booking-date-error' : undefined} />{errors.preferredDate && <p id="booking-date-error" className="field-error" role="alert"><AlertCircle size={14} />{errors.preferredDate}</p>}</div>
            <fieldset className="field"><legend>{t('booking.field.time')}</legend><div className="slot-grid">{timeSlots.map(slot => <button key={slot} type="button" className="slot-button" aria-pressed={formData.preferredTime === slot} onClick={() => update('preferredTime', slot)}>{slot.replace(' Europe/Madrid','')}</button>)}</div></fieldset>
            <p className="booking-note"><Clock size={17} /><span>{es ? 'Horario de Madrid. Comprobaremos la disponibilidad antes de enviar la invitación a tu correo.' : 'Madrid time. We’ll check availability before sending an invitation to your email.'}</span></p>
          </div>}
          {step === 3 && <div className="form-stack">
            <div className="field"><label htmlFor="booking-name">{es ? 'Nombre completo *' : 'Full name *'}</label><input id="booking-name" name="name" required autoComplete="name" value={formData.fullName} onChange={event => update('fullName', event.target.value)} placeholder={es ? 'Tu nombre y apellidos' : 'Your full name'} aria-invalid={!!errors.fullName} aria-describedby={errors.fullName ? 'booking-name-error' : undefined} />{errors.fullName && <p id="booking-name-error" className="field-error" role="alert"><AlertCircle size={14} />{errors.fullName}</p>}</div>
            <div className="field"><label htmlFor="booking-email">{es ? 'Correo electrónico *' : 'Email address *'}</label><input id="booking-email" type="email" required name="email" autoComplete="email" value={formData.email} onChange={event => update('email', event.target.value)} placeholder={es ? 'Donde recibirás tu invitación' : 'Where you’ll receive your invitation'} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'booking-email-error' : undefined} />{errors.email && <p id="booking-email-error" className="field-error" role="alert"><AlertCircle size={14} />{errors.email}</p>}</div>
            <div className="form-row"><div className="field"><label htmlFor="booking-phone">{es ? 'Teléfono' : 'Phone'}</label><input id="booking-phone" type="tel" autoComplete="tel" value={formData.phone} onChange={event => update('phone', event.target.value)} placeholder="+34 600 000 000" /></div><div className="field"><label htmlFor="booking-company">{es ? 'Empresa' : 'Company'}</label><input id="booking-company" autoComplete="organization" value={formData.company} onChange={event => update('company', event.target.value)} placeholder={es ? 'Opcional' : 'Optional'} /></div></div>
            <p className="form-footnote">{es ? '* Campos obligatorios. Usaremos estos datos para gestionar tu sesión.' : '* Required fields. We’ll use these details to arrange your session.'}</p>
          </div>}
          {submitError && <p className="notice booking-submit-error" role="alert"><AlertCircle size={17} />{submitError}</p>}
          <div className="booking-actions">{step > 1 ? <button className="text-link" type="button" onClick={handleBack} disabled={submitting}><ArrowLeft size={17} />{es ? 'Atrás' : 'Back'}</button> : <span />}
            <button className="button button-primary" type="submit" disabled={submitting}>{submitting ? <><LoaderCircle className="spinner" size={17} />{es ? 'Confirmando…' : 'Confirming…'}</> : <>{step < 3 ? (es ? 'Continuar' : 'Continue') : (es ? 'Confirmar sesión' : 'Confirm session')}<ArrowRight size={17} /></>}</button></div>
        </form>
      </> : <div className="success-state" role="status"><span className="success-symbol"><Check size={30} /></span><h2 id="booking-title">{t('booking.success.title')}</h2><p>{t('booking.success.msg')}</p><dl className="booking-summary"><div><dt>{es ? 'Nombre' : 'Name'}</dt><dd>{formData.fullName}</dd></div><div><dt>{es ? 'Servicio' : 'Service'}</dt><dd>{formData.serviceCategory}</dd></div><div><dt>{es ? 'Fecha' : 'Date'}</dt><dd>{formData.preferredDate}</dd></div><div><dt>{es ? 'Horario' : 'Time'}</dt><dd>{formData.preferredTime}</dd></div></dl><button className="button button-primary" onClick={handleResetAndClose}>{es ? 'Listo' : 'Done'}<Check size={17} /></button></div>}
    </div>
  </div>;
};
