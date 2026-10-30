import type { ServiceItem } from '../types';

export const advisoryServices: ServiceItem[] = [
  {
    id: 'consulting', level: 0, iconName: 'Compass',
    levelBadge: { es: 'CONSULTORÍA', en: 'CONSULTING' },
    title: { es: 'Consultoría estratégica en Data e IA', en: 'Data & AI strategy consulting' },
    subtitle: { es: 'Una dirección clara antes de invertir', en: 'A clear direction before you invest' },
    description: { es: 'Te ayudamos a identificar oportunidades, evaluar tu arquitectura y priorizar iniciativas de datos, automatización e inteligencia artificial. Desde una consulta puntual hasta el acompañamiento de tu equipo.', en: 'Identify opportunities, review your architecture and prioritize data, automation and AI initiatives. From a focused consultation to ongoing support for your team.' },
    deliverables: { es: ['Diagnóstico de madurez y necesidades', 'Hoja de ruta y priorización de casos de uso', 'Revisión de arquitectura y decisiones técnicas', 'Plan de acción con indicadores de seguimiento'], en: ['Maturity and needs assessment', 'Roadmap and use case prioritization', 'Architecture and technical decision review', 'Action plan with progress indicators'] },
    businessImpact: { es: 'Decisiones fundamentadas, alcance definido y una inversión alineada con tus objetivos.', en: 'Informed decisions, a defined scope and investment aligned with your goals.' },
    techStack: ['Data Strategy', 'AI Readiness', 'Roadmap', 'Architecture'],
  },
  {
    id: 'tutoring', level: 0, iconName: 'GraduationCap',
    levelBadge: { es: 'TUTORÍAS', en: 'TUTORING' },
    title: { es: 'Tutorías y formación personalizada', en: 'Personalized tutoring & training' },
    subtitle: { es: 'Aprende haciendo, con acompañamiento', en: 'Learn by doing, with expert guidance' },
    description: { es: 'Sesiones individuales o para equipos, adaptadas a tu nivel y objetivos. Refuerza tus conocimientos de Python, SQL, Power BI, ciencia de datos e IA con ejercicios prácticos y revisión de tus propios proyectos.', en: 'Individual or team sessions tailored to your level and goals. Build Python, SQL, Power BI, data science and AI skills through practical exercises and reviews of your own projects.' },
    deliverables: { es: ['Evaluación inicial y plan de aprendizaje', 'Sesiones prácticas individuales o en equipo', 'Revisión de código y resolución de dudas', 'Material de apoyo y próximos pasos'], en: ['Initial assessment and learning plan', 'Hands-on individual or team sessions', 'Code review and questions answered', 'Learning materials and next steps'] },
    businessImpact: { es: 'Gana autonomía técnica y aplica lo aprendido en problemas reales, a tu ritmo.', en: 'Build technical confidence and apply your learning to real problems, at your pace.' },
    techStack: ['Python', 'SQL', 'Power BI', 'Machine Learning'],
  },
];
