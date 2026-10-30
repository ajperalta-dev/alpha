import { useTheme } from '../../context/theme';

export function BrandLockup({ size = 'nav' }: { size?: 'nav' | 'footer' }) {
  const { isDark } = useTheme();
  return <span className={`brand-lockup brand-lockup--${size}`}>
    <img src={`/brand/identity-alpha/alpha-horizontal-${isDark ? 'oscuro' : 'claro'}.svg`} alt="ALPHA" width="880" height="256" />
    <span className="brand-descriptor">DIGITAL TRANSFORMATION</span>
  </span>;
}
