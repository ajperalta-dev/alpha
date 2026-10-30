import { useId, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useLanguage } from '../../context/language';
import { createIntroTimeline, introConfig } from '../../lib/animations/introTimeline';
import { IntroSymbol } from './IntroSymbol';

export function BrandIntro() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<() => void>(() => {});
  const maskId = useId().replace(/:/g, '');
  const { lang } = useLanguage();

  useLayoutEffect(() => {
    const overlay = overlayRef.current!;
    const site = overlay.closest<HTMLElement>('.alpha-site')!;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let seen = false;
    try { seen = introConfig.oncePerSession && sessionStorage.getItem(introConfig.storageKey) === 'true'; } catch { /* Private browsing: run without persistence. */ }
    // Preserve anchor navigation and the browser's restored scroll position.
    const simple = seen || reduced.matches || Boolean(location.hash && location.hash !== '#hero') || scrollY > 0;
    const regions = [...site.children].filter((node): node is HTMLElement => node instanceof HTMLElement && node !== overlay);
    const previousInert = regions.map(node => node.inert);
    const previousOverflow = document.documentElement.style.overflow;
    const previousGutter = document.documentElement.style.scrollbarGutter;
    let finished = false;
    let timeline: gsap.core.Timeline;
    let fallback: number | undefined;

    const unlock = () => {
      document.documentElement.style.overflow = previousOverflow;
      document.documentElement.style.scrollbarGutter = previousGutter;
      regions.forEach((node, index) => { node.inert = previousInert[index]; });
    };
    const removeListeners = () => {
      document.removeEventListener('keydown', onKey, true);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pagehide', onPageHide);
      reduced.removeEventListener('change', onMotionChange);
      window.clearTimeout(fallback);
      skipRef.current = () => {};
    };
    const complete = () => {
      if (finished) return;
      finished = true;
      unlock();
      removeListeners();
      try { sessionStorage.setItem(introConfig.storageKey, 'true'); } catch { /* Storage is optional. */ }
      site.dataset.introState = 'complete';
      window.dispatchEvent(new Event('alpha:intro-complete'));
      // Context reversion clears temporary transforms and will-change together.
      context.revert();
      if (overlay.contains(document.activeElement)) site.querySelector<HTMLElement>('.brand-home')?.focus({ preventScroll: true });
    };
    const skip = () => {
      if (finished) return;
      // Advance the existing sequence in at most 450ms; never tear away the mask.
      timeline.timeScale(Math.max(timeline.timeScale(), (timeline.duration() - timeline.time()) / .45));
    };
    const onKey = (event: KeyboardEvent) => {
      if (!['Enter', ' ', 'Escape'].includes(event.key) || event.altKey || event.ctrlKey || event.metaKey) return;
      event.preventDefault();
      event.stopPropagation();
      skip();
    };
    const onResize = () => { timeline.invalidate(); skip(); };
    const onMotionChange = () => {
      if (!reduced.matches || finished) return;
      // A live change to reduced motion immediately resolves all moving elements.
      timeline.progress(1);
    };
    const onPageHide = () => { timeline.progress(1); };
    const context = gsap.context(() => {
      site.dataset.introState = simple ? 'fade' : 'playing';
      if (!simple) {
        document.documentElement.style.scrollbarGutter = 'stable';
        document.documentElement.style.overflow = 'hidden';
        regions.forEach(node => { node.inert = true; });
      }
      timeline = createIntroTimeline(site, overlay, simple, complete);
    }, site);
    skipRef.current = skip;
    if (!simple) {
      document.addEventListener('keydown', onKey, true);
      window.addEventListener('resize', onResize);
      window.addEventListener('pagehide', onPageHide);
      reduced.addEventListener('change', onMotionChange);
    }
    // A safety limit also releases the page if a background tab throttles GSAP.
    fallback = window.setTimeout(() => timeline.progress(1), 6000);
    timeline!.play();
    return () => {
      finished = true;
      removeListeners();
      context.revert();
      unlock();
      delete site.dataset.introState;
    };
  }, []);

  return <div ref={overlayRef} className="brand-intro" onClick={() => skipRef.current()}>
    <svg className="brand-intro-veil" aria-hidden="true" width="100%" height="100%">
      <defs><mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%" style={{ maskType: 'luminance' }}>
        <rect width="100%" height="100%" fill="white" />
        <circle data-intro-aperture cx="50%" cy="50%" r="0" fill="black" />
      </mask></defs>
      <rect width="100%" height="100%" fill="black" mask={`url(#${maskId})`} />
    </svg>
    <div className="brand-intro-symbol" data-intro-symbol><IntroSymbol /></div>
    <button type="button" className="brand-intro-skip" data-intro-skip>{lang === 'es' ? 'Saltar intro' : 'Skip intro'} <span aria-hidden="true">↵</span></button>
  </div>;
}
