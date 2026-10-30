import { Activity, Boxes, ChartNoAxesCombined } from 'lucide-react';
export function CaseVisual({ kind, lang }: { kind: number; lang: 'es' | 'en' }) {
  const Icon = [Activity, Boxes, ChartNoAxesCombined][kind] ?? Activity;
  const es = lang === 'es';
  const names = es ? ['Inteligencia de planta', 'Demanda conectada', 'Visión ejecutiva'] : ['Plant intelligence', 'Connected demand', 'Executive visibility'];
  return <div className="case-visual is-playing">
    <div className="case-visual-header"><span><Icon size={15} />{names[kind]}</span></div>
    <svg viewBox="0 0 340 180" className="scene" fill="none" aria-hidden="true">
      {kind === 0 ? <>
        <rect x="20" y="35" width="300" height="108" rx="12" className="case-scene-line" opacity=".35" />
        <path d="M34 96H55L68 75 80 115 94 65 108 108 120 91H147L160 54 174 124 188 76 202 97H223L236 79 247 104 260 92H305" pathLength="100" className="case-scene-trace" />
        <circle cx="160" cy="54" r="7" className="case-scene-beacon" /><circle cx="160" cy="54" r="18" className="case-scene-ripple" />
      </> : kind === 1 ? <>
        {[0,1,2,3].map(i => <g key={i}><rect x={28+i*43} y={112-i*15} width="28" height={40+i*15} rx="5" fill="currentColor" opacity=".22" /><path d={`M${35+i*43} ${120-i*15}h14`} className="case-scene-line" /></g>)}
        <path d="M25 91Q71 100 106 66T193 56T267 23" pathLength="100" className="case-scene-trace" /><path d="M194 56Q237 66 301 21" stroke="currentColor" strokeWidth="2" strokeDasharray="4 5" />
        <rect x="233" y="98" width="71" height="52" rx="9" className="case-scene-line" /><path d="M249 115h38M249 129h23" className="case-scene-line" opacity=".5" /><circle cx="267" cy="23" r="5" className="case-scene-beacon" />
      </> : <>
        <rect x="28" y="25" width="285" height="127" rx="12" className="case-scene-line" opacity=".5" /><path d="M28 52H313M135 52V152" className="case-scene-line" opacity=".25" />
        {[46,59,72].map(x => <circle key={x} cx={x} cy="38" r="2" fill="currentColor" />)}
        {[0,1,2].map(i => <rect key={i} x="46" y={68+i*25} width={67-i*12} height="9" rx="4" fill="currentColor" opacity={.25+i*.15} />)}
        <path d="M154 128 182 103 205 114 229 85 253 91 291 68" pathLength="100" className="case-scene-trace" /><circle cx="291" cy="68" r="5" className="case-scene-beacon" /><path d="M124 165H216" className="case-scene-line" opacity=".35" />
      </>}
    </svg>
  </div>;
}
