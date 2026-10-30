# ALPHA · Data, IA, consultoría y tutorías

Webapp bilingüe construida con React 19, TypeScript, Vite y un servidor Node. La interfaz conserva el tema oscuro/cian, ofrece modo claro y funciona en escritorio y móvil.

## Puesta en marcha

1. Instala las dependencias con `npm install`.
2. Copia `.env.example` como `.env`.
3. Instala Ollama y descarga `gemma3:4b` con `ollama pull gemma3:4b`.
4. Ejecuta `npm run dev` y abre `http://127.0.0.1:5176`.

Comandos disponibles:

```sh
npm run dev       # servidor Node + Vite para desarrollo
npm run build     # compilación de producción
npm run preview   # sirve dist/ y el endpoint del asistente
npm run lint
```

## Asistente local con respaldo de OpenAI

El navegador envía la conversación a `POST /api/chat`. Por defecto, el servidor consulta Gemma 3 4B mediante Ollama en el propio equipo. Si Ollama no está disponible y el respaldo está activado, intenta usar OpenAI. `OPENAI_API_KEY` se lee solamente en el servidor y nunca forma parte del bundle del navegador.

Variables:

```env
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=gemma3:4b
OPENAI_FALLBACK_ENABLED=true
OPENAI_API_KEY=sk-your-server-key
OPENAI_MODEL=gpt-6-luna
PORT=5176
```

Los proveedores y modelos pueden cambiarse sin tocar código. Usa `AI_PROVIDER=openai` para convertir OpenAI en el proveedor principal, o `OPENAI_FALLBACK_ENABLED=false` para operar solo en local. El endpoint limita tamaño, historial, tiempo de espera y frecuencia básica por dirección IP. Para un despliegue público con varias instancias, conviene sustituir el límite en memoria por uno compartido y añadir protección adicional frente a abuso.

Sin una clave válida, Ollama sigue funcionando. OpenAI solo genera consumo facturable cuando actúa como proveedor o respaldo.

## Contenido y funciones

- Ocho soluciones: seis disciplinas técnicas, consultoría estratégica y tutorías personalizadas.
- Búsqueda, filtros y detalles de servicios.
- Casos de uso presentados como aplicaciones posibles, sin cifras de resultados no verificadas.
- Formulario conectado a Google Calendar, con validación de horario Europe/Madrid, disponibilidad e invitación al asistente.
- Formulario de contacto mediante correo precompletado.
- Asistente real para orientar sobre servicios, consultoría y tutorías.
- Preguntas frecuentes, navegación móvil, accesibilidad de modales y preferencias de tema e idioma.

## Privacidad y publicación

### Vercel

El proyecto incluye `vercel.json` y una función compartida en `api/index.mjs` para el asistente, las reservas y sus comprobaciones de configuración. En Vercel se construye con `npm run build` y se publica `dist`.

Configura las variables necesarias en el entorno del proyecto de Vercel, nunca en GitHub. Para el asistente público usa `AI_PROVIDER=openai` y configura `OPENAI_API_KEY`. Para las reservas configura las variables Google Calendar indicadas en `.env.example`. Sin estas credenciales las API informan que están pendientes de configuración; el diseño de la web sigue funcionando. Ollama en localhost no es accesible desde Vercel.

Para desplegar con tu cuenta: `npx vercel login`, `npx vercel link` y `npx vercel --prod`. `.env` y las carpetas locales de credenciales quedan excluidos del envío.

El texto enviado al asistente se procesa localmente mientras Ollama esté disponible. Puede transmitirse a OpenAI si se activa el respaldo y el modelo local falla. La interfaz avisa de no introducir información sensible y no conserva la conversación entre recargas. Antes de publicar, completa los textos legales del titular y adapta la información de privacidad al despliegue y configuración definitivos.

Las reservas crean un evento real y solicitan a Google notificaciones para los invitados solo cuando la integración está autorizada. La llegada al buzón depende de Google y de las preferencias del destinatario.

## Conectar la agenda corporativa

1. En Google Cloud habilita Google Calendar API y configura la pantalla de consentimiento OAuth. Si la app está en pruebas, añade alpha.digital.ia@gmail.com como usuario de prueba.
2. Crea un cliente OAuth de tipo aplicación web, con URI de redirección http://127.0.0.1:5180/oauth/callback.
3. Guarda GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET únicamente en .env.
4. Ejecuta npm run calendar:connect y abre la URL que aparece. Autoriza con alpha.digital.ia@gmail.com. El script comprueba la cuenta y guarda el refresh token en .env, sin imprimirlo.
5. Reinicia npm run dev. El botón Preparar solicitud llama a POST /api/bookings, comprueba disponibilidad y crea un evento privado de 30 minutos con todos los datos, el invitado y sendUpdates=all.

La API no envía invitaciones mientras falte autorización. Una cuenta de Gmail conectada a Codex no autoriza al servidor de la web. Google puede caducar los refresh tokens de aplicaciones OAuth en pruebas; revisa el estado de publicación antes del despliegue. El despliegue público debe contar con protección antiabuso y bloqueo compartido de horarios si ejecuta varias instancias; el bloqueo actual es local al proceso.

## Respuestas breves

El modelo local permanece cargado 30 minutos, procesa hasta seis mensajes y genera hasta 110 tokens con contexto de 2048. La instrucción solicita de una a tres frases, hasta 55 palabras.

Proyecto Google Cloud creado: alpha-calendar-510710 (ALPHA Calendar), cuenta alpha.digital.ia@gmail.com. Pendiente habilitar Calendar API, crear cliente OAuth y autorizar.
