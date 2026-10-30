import type { Language } from '../../types';

type CardCopy = { title: string; category: string; benefit: string; explanation: string; includes: [string, string] };

export const servicePresentation: Record<string, Record<Language, CardCopy>> = {
  'data-analytics-bi': {
    es: { title: 'Analítica y cuadros de mando', category: 'Datos y analítica', benefit: 'Entiende qué está pasando en tu negocio.', explanation: "Reunimos datos de ventas, costes y operaciones en un panel que se actualiza automáticamente para que puedas seguir los indicadores de tu empresa.", includes: ['Informes automáticos y actualizados', 'Indicadores claros para tu equipo'] },
    en: { title: 'Analytics & dashboards', category: 'Data & analytics', benefit: 'Understand what is happening in your business.', explanation: "Bring sales, cost and operational data into an automatically updated dashboard so you can follow your business metrics.", includes: ['Automated, up-to-date reports', 'Clear metrics for your team'] },
  },
  'data-engineering': {
    es: { title: 'Ingeniería de datos', category: 'Arquitectura de datos', benefit: 'Tu información conectada, ordenada y disponible.', explanation: "Conectamos las herramientas que ya utilizas y preparamos sus datos para que puedas analizarlos sin tener que reunirlos a mano.", includes: ['Tus fuentes de información conectadas', 'Datos organizados y controles de calidad'] },
    en: { title: 'Data engineering', category: 'Data architecture', benefit: 'Your information, connected and ready to use.', explanation: "Connect the tools you already use and prepare their data for analysis, so you no longer need to bring it together manually.", includes: ['Connected information sources', 'Organized data and quality checks'] },
  },
  'machine-learning': {
    es: { title: 'Modelos predictivos', category: 'Inteligencia artificial', benefit: 'Anticipa la demanda y detecta oportunidades.', explanation: "Utilizamos tus datos históricos para crear y evaluar modelos que estimen la demanda, identifiquen patrones o avisen de posibles riesgos.", includes: ['Previsiones adaptadas a tus datos', 'Patrones y alertas para tomar decisiones'] },
    en: { title: 'Predictive models', category: 'Artificial intelligence', benefit: 'Anticipate demand and identify opportunities.', explanation: "Use your historical data to build and evaluate models that estimate demand, identify patterns or flag potential risks.", includes: ['Forecasts tailored to your data', 'Patterns and alerts to guide decisions'] },
  },
  'genai-enterprise': {
    es: { title: 'Asistentes y automatización con IA', category: 'IA generativa', benefit: 'Convierte tu conocimiento en respuestas útiles.', explanation: "Creamos asistentes conectados a tus documentos y herramientas para encontrar información y ejecutar tareas concretas, con permisos y revisión humana.", includes: ['Asistentes que consultan tus documentos', 'Automatización de tareas repetitivas'] },
    en: { title: 'AI assistants & automation', category: 'Generative AI', benefit: 'Turn your knowledge into useful answers.', explanation: "Build assistants connected to your documents and tools to find information and carry out specific tasks, with access controls and human review.", includes: ['Assistants that consult your documents', 'Automation of repetitive tasks'] },
  },
  'mlops-scale': {
    es: { title: 'IA en producción', category: 'Operación de modelos', benefit: 'Lleva tus modelos del prototipo al día a día.', explanation: "Integramos los modelos en tus aplicaciones y supervisamos cómo funcionan. Preparamos su actualización y mantenimiento para que tu equipo pueda utilizarlos a diario.", includes: ['Integración en tus herramientas de trabajo', 'Seguimiento del rendimiento de los modelos'] },
    en: { title: 'AI in production', category: 'Model operations', benefit: 'Move your models from prototype to everyday use.', explanation: "Integrate models into your applications and monitor their performance. Plan updates and maintenance so your team can use them every day.", includes: ['Integration with your working tools', 'Monitoring of model performance'] },
  },
  'industry-40': {
    es: { title: 'Industria conectada', category: 'Industria 4.0', benefit: 'Conecta tu planta con decisiones más inteligentes.', explanation: "Analizamos la información de sensores y sistemas de planta para detectar anomalías, comprender el rendimiento de los equipos y apoyar el mantenimiento.", includes: ['Información de sensores y equipos reunida', 'Alertas para planificar el mantenimiento'] },
    en: { title: 'Connected industry', category: 'Industry 4.0', benefit: 'Connect your plant to smarter decisions.', explanation: "Analyze information from sensors and plant systems to detect anomalies, understand equipment performance and support maintenance.", includes: ['Sensor and equipment data brought together', 'Alerts to help plan maintenance'] },
  },
  consulting: {
    es: { title: 'Consultoría de datos e IA', category: 'Consultoría', benefit: 'Una dirección clara antes de invertir.', explanation: "Revisamos tu situación y tus objetivos contigo. Identificamos qué iniciativas tienen sentido y definimos un plan antes de empezar a desarrollar.", includes: ['Diagnóstico de tu situación', 'Hoja de ruta con prioridades'] },
    en: { title: 'Data & AI consulting', category: 'Consulting', benefit: 'A clear direction before you invest.', explanation: "Review your situation and goals together, identify which initiatives make sense and define a plan before development begins.", includes: ['An assessment of your situation', 'A roadmap with clear priorities'] },
  },
  tutoring: {
    es: { title: 'Tutorías y formación', category: 'Formación', benefit: 'Aprende haciendo, con acompañamiento.', explanation: "Trabajamos contigo sobre ejercicios y proyectos de Python, SQL, Power BI o IA. Adaptamos las sesiones a tu nivel y resolvemos tus dudas paso a paso.", includes: ['Sesiones prácticas adaptadas a tu nivel', 'Revisión de proyectos y resolución de dudas'] },
    en: { title: 'Tutoring & training', category: 'Training', benefit: 'Learn by doing, with expert guidance.', explanation: "Work with you on Python, SQL, Power BI or AI exercises and projects. Adapt sessions to your level and work through your questions step by step.", includes: ['Hands-on sessions adapted to your level', 'Project reviews and questions answered'] },
  },
};
