/** Exact contours from public/brand/identity-alpha/alpha-isotipo-oscuro.svg. */
export function IntroSymbol() {
  return <svg viewBox="0 0 256 256" aria-hidden="true">
    <circle data-intro-disc cx="128" cy="128" r="128" fill="white" />
    {[0, 32, 64].map(offset => <g key={offset} transform={`translate(0 ${offset})`}>
      <path data-intro-stripe fill="black" d="M64 84 Q128 108 192 84 A6 6 0 0 1 196 96 Q128 122 60 96 A6 6 0 0 1 64 84 Z" />
    </g>)}
  </svg>;
}
