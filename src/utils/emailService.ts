import type { BookingFormData } from '../types';

/** Builds a personal Google Calendar reminder. It does not confirm availability. */
export function buildGoogleCalendarUrl(data: BookingFormData, lang: string): string {
  const { preferredDate, preferredTime, serviceCategory, fullName, company, email, projectDescription } = data;
  const [year, month, day] = preferredDate.split('-').map(Number);
  const [hour, minute] = preferredTime.split(' ')[0].split(':').map(Number);
  const pad = (value: number) => String(value).padStart(2, '0');
  const start = `${year}${pad(month)}${pad(day)}T${pad(hour)}${pad(minute)}00`;
  const endDate = new Date(year, month - 1, day, hour, minute + 30);
  const end = `${endDate.getFullYear()}${pad(endDate.getMonth() + 1)}${pad(endDate.getDate())}T${pad(endDate.getHours())}${pad(endDate.getMinutes())}00`;
  const title = lang === 'es' ? `Solicitud ALPHA · ${serviceCategory}` : `ALPHA request · ${serviceCategory}`;
  const details = lang === 'es'
    ? `Solicitud pendiente de confirmación.\nNombre: ${fullName}${company ? ` · ${company}` : ''}\nEmail: ${email}\nServicio: ${serviceCategory}${projectDescription ? `\nNotas: ${projectDescription}` : ''}`
    : `Request pending confirmation.\nName: ${fullName}${company ? ` · ${company}` : ''}\nEmail: ${email}\nService: ${serviceCategory}${projectDescription ? `\nNotes: ${projectDescription}` : ''}`;
  return `https://calendar.google.com/calendar/render?${new URLSearchParams({
    action: 'TEMPLATE', text: title, dates: `${start}/${end}`, details,
    location: 'Online · pending confirmation', ctz: 'Europe/Madrid', sf: 'true', output: 'xml',
  }).toString()}`;
}
