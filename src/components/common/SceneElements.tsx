/** Lightweight, code-native atmosphere: no additional image or video downloads. */
export function SceneBackdrop() {
  return <div className="scene-backdrop" aria-hidden="true"><div className="scene-depth" /></div>;
}

export function SceneHeading({ children }: { children: string }) {
  const lines = children.split(/(?<=\.)\s+/);
  return <h2>{lines.map((line, index) => <span className="scene-line-mask" key={index}><span className="scene-line">{line}</span>{index < lines.length - 1 ? ' ' : ''}</span>)}</h2>;
}
