export function PhaseAnimation({ phase, lang }: { phase: number; lang: 'es' | 'en' }) {
  return <div className="phase-animation" aria-hidden="true">
    <svg viewBox="0 0 280 220" className="w-full h-auto" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {phase === 0 ? <>
        <path d="M72 35h92l24 24v112H72ZM164 35v25h24M91 80h75M91 102h56M91 125h38" opacity=".5" />
        <g className="phase-scan"><circle cx="181" cy="134" r="30" /><path d="m203 156 25 25" strokeWidth="5" /><path d="m168 134 9 9 17-19" stroke="currentColor" /></g>
      </> : phase === 1 ? <>
        <path d="M83 82h114M140 85v50" className="phase-signal" />
        {[[42, 47], [190, 47], [116, 132]].map(([x, y], i) => <g key={i} className="phase-node" style={{ animationDelay: `${i * .5}s` }}>
          <rect x={x} y={y} width="48" height="48" rx="8" /><path d={`M${x + 13} ${y + 17}h22M${x + 13} ${y + 29}h14`} opacity=".5" /></g>)}
        <path d="m123 199 11 9 25-26" stroke="currentColor" className="phase-node" />
      </> : phase === 2 ? <>
        <g className="phase-launch">
          <path d="M140 28c-29 26-38 59-31 100h62c7-41-2-74-31-100ZM108 96l-26 35v25l29-16M172 96l26 35v25l-29-16M124 128v17h32v-17" />
          <circle cx="140" cy="77" r="13" />
          <path d="M126 155q14 39 28 0M140 163v33" stroke="currentColor" className="phase-node" />
        </g>
        <path d="M68 204h144" opacity=".25" />
      </> : <>
        <g className="phase-cycle"><path d="M88 75a65 65 0 0 1 108 4l-1-25M196 79l-24-3M192 145a65 65 0 0 1-108-4l1 25M84 141l24 3" /></g>
        <path d="M111 115h13l9-20 12 37 12-22h17" stroke="currentColor" />
        {[55, 225].map((x, i) => <circle key={x} cx={x} cy="110" r="5" fill="currentColor" className="phase-node" style={{ animationDelay: `${i}s` }} />)}
      </>}
    </svg>
    <p className="animation-caption">
      {lang === 'es' ? ['Diagnosticar antes de decidir.', 'Conectar, probar y validar.', 'Del prototipo a producción.', 'Medir, aprender y mejorar.'][phase] : ['Diagnose before deciding.', 'Connect, test and validate.', 'From prototype to production.', 'Measure, learn and improve.'][phase]}
    </p>
  </div>;
}
