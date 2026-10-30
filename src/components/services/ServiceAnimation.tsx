import type { ReactNode } from 'react';

const captions: Record<string, [string, string]> = {
  BarChart3: ['Datos que se convierten en decisiones', 'Data becoming decisions'],
  Database: ['Un flujo de datos conectado y ordenado', 'A connected, organized data flow'],
  Cpu: ['Patrones que anticipan el siguiente paso', 'Patterns predicting the next step'],
  Sparkles: ['De una pregunta a una respuesta útil', 'From a question to a useful answer'],
  Server: ['Modelos que llegan a producción', 'Models moving into production'],
  Factory: ['Sensores, procesos y máquinas conectados', 'Connected sensors, processes and machines'],
  Compass: ['Una hoja de ruta para avanzar', 'A roadmap for moving forward'],
  GraduationCap: ['Aprender, practicar y progresar', 'Learn, practice and progress'],
};

export function ServiceAnimation({ icon, lang }: { icon: string; lang: 'es' | 'en' }) {
  let scene: ReactNode;
  switch (icon) {
    case 'BarChart3':
      scene = <><path d="M35 35V190H285" className="service-line" />
        {[62, 110, 158, 206, 254].map((x, i) => <rect key={x} x={x} y={166 - i * 25} width="22" height={24 + i * 25} rx="4" className="service-bar" style={{ animationDelay: `${i * .18}s` }} />)}
        <path d="M60 148 110 128 160 140 210 81 265 50" className="service-draw" pathLength="100" /></>;
      break;
    case 'Database':
      scene = <><path d="M55 100H130M190 100H265" className="service-flow" />
        {[45, 140, 235].map((x, i) => <g key={x} className="service-node" style={{ animationDelay: `${i * .4}s` }}>
          <path d={`M${x} 65v70c0 18 50 18 50 0V65`} className="service-line" /><ellipse cx={x + 25} cy="65" rx="25" ry="10" className="service-line" /><path d={`M${x} 100c0 18 50 18 50 0`} className="service-line" /></g>)}
        <circle r="4" cx="160" cy="165" className="service-packet" /></>;
      break;
    case 'Cpu':
      scene = <><path d="M35 35V190H285" className="service-line" />
        {[[55, 166], [84, 143], [113, 149], [142, 114], [171, 101], [200, 82], [229, 67]].map(([x, y], i) => <circle key={x} cx={x} cy={y} r="5" className="service-node" style={{ animationDelay: `${i * .2}s` }} />)}
        <path d="M48 169Q130 135 200 87T278 36" pathLength="100" className="service-draw" /><path d="M236 76 278 36 278 76" className="service-line service-accent" /></>;
      break;
    case 'Sparkles':
      scene = <><rect x="38" y="45" width="160" height="58" rx="14" className="service-line" /><path d="M55 103v15l22-15" className="service-line" />
        <rect x="115" y="123" width="165" height="67" rx="14" className="service-line" />
        {[0, 1, 2].map(i => <path key={i} d={`M135 ${142 + i * 14}H${255 - i * 15}`} pathLength="100" className="service-draw" style={{ animationDelay: `${i * .5}s` }} />)}
        <path d="m234 33 6 16 17 6-17 6-6 17-6-17-17-6 17-6Z" className="service-line service-accent service-node" /><circle cx="70" cy="75" r="4" className="service-node" /><circle cx="95" cy="75" r="4" className="service-node" /><circle cx="120" cy="75" r="4" className="service-node" /></>;
      break;
    case 'Server':
      scene = <><path d="M68 70H252V161H68Z" className="service-flow" />
        {[[45, 48], [230, 48], [230, 139], [45, 139]].map(([x, y], i) => <g key={i} className="service-node" style={{ animationDelay: `${i * .45}s` }}><rect x={x} y={y} width="45" height="44" rx="8" className="service-line" /><path d={`m${x + 12} ${y + 22} 8 8 14-16`} className="service-line service-accent" /></g>)}
        <text x="160" y="115" textAnchor="middle" fill="currentColor" fontSize="14" fontFamily="inherit">CI / CD</text></>;
      break;
    case 'Factory':
      scene = <><path d="M35 180V103l60-30v30l60-30v30h80v77ZM246 103V45h25v135M60 130h18v20H60ZM110 130h18v20h-18ZM161 130h18v20h-18Z" className="service-line" />
        <path d="M50 45H215M50 45V85M135 45V77M215 45V95" className="service-flow" />
        {[50, 135, 215].map((x, i) => <circle key={x} cx={x} cy="45" r="7" className="service-node service-accent" style={{ animationDelay: `${i * .4}s` }} />)}
        <path d="M280 85h18v45h-18" className="service-draw" pathLength="100" /></>;
      break;
    case 'Compass':
      scene = <><path d="M50 175Q80 90 135 125T265 45" className="service-flow" />
        {[[50, 175], [125, 120], [205, 111], [265, 45]].map(([x, y], i) => <g key={i} className="service-node" style={{ animationDelay: `${i * .5}s` }}><circle cx={x} cy={y} r="14" className="service-line" /><text x={x} y={y + 4} textAnchor="middle" fill="currentColor" fontSize="11">{i + 1}</text></g>)}
        <path d="M265 30V12l25 9-25 9" className="service-line service-accent" /></>;
      break;
    default:
      scene = <><path d="M160 65Q105 35 45 60v113q60-25 115 3 55-28 115-3V60q-60-25-115 5ZM160 65v111" className="service-line" />
        {[0, 1, 2].map(i => <g key={i}><path d={`M65 ${85 + i * 22}q35-12 75 1M180 ${86 + i * 22}q35-12 75-1`} className="service-draw" pathLength="100" style={{ animationDelay: `${i * .5}s` }} /></g>)}
        <path d="m137 25 14 14 29-27" className="service-line service-accent service-node" /></>;
  }
  return <div className="service-animation" aria-hidden="true">
    <svg viewBox="0 0 320 220" className="w-full h-auto" fill="none" strokeLinecap="round" strokeLinejoin="round">{scene}</svg>
    <p className="animation-caption">{(captions[icon] ?? captions.GraduationCap)[lang === 'es' ? 0 : 1]}</p>
  </div>;
}
