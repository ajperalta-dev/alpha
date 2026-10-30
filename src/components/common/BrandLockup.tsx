import { useTheme } from '../../context/theme';

export function BrandLockup({ size = 'nav', darkSurface = false }: { size?: 'nav' | 'footer'; darkSurface?: boolean }) {
  const { isDark } = useTheme();
  const useDarkArtwork = darkSurface || isDark;
  return <span className={`brand-lockup brand-lockup--${size}`}>
    <img src={`/brand/identity-alpha/alpha-horizontal-${useDarkArtwork ? 'oscuro' : 'claro'}.svg`} alt="ALPHA" width="880" height="256" />
  </span>;
}
