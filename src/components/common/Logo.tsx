import React from 'react';
import { useTheme } from '../../context/theme';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showText?: boolean;
  variant?: 'auto' | 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true, variant = 'auto' }) => {
  const { isDark } = useTheme();
  const darkArtwork = variant === 'dark' || (variant === 'auto' && isDark);
  const dimensions = showText
    ? { sm: 'w-44', md: 'w-48', lg: 'w-64', hero: 'w-full max-w-[440px]' }[size]
    : { sm: 'w-8', md: 'w-12', lg: 'w-24', hero: 'w-full max-w-[440px]' }[size];
  const mark = showText ? 'horizontal' : 'isotipo';
  return <img src={`/brand/identity-alpha/alpha-${mark}-${darkArtwork ? 'oscuro' : 'claro'}.svg`}
    alt="ALPHA" className={`object-contain ${dimensions} ${className}`} />;
};
