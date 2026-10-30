import { gsap } from 'gsap';

export const introConfig = {
  storageKey: 'alpha:hasSeenIntro:v1',
  oncePerSession: true,
  desktopDuration: 3.8,
  mobileDuration: 2.7,
  fadeDuration: .4,
};

export function createIntroTimeline(site: HTMLElement, overlay: HTMLElement, simple: boolean, onComplete: () => void) {
  const select = gsap.utils.selector(site);
  const symbol = overlay.querySelector<HTMLElement>('[data-intro-symbol]')!;
  const aperture = overlay.querySelector('[data-intro-aperture]')!;
  const disc = overlay.querySelector('[data-intro-disc]')!;
  const stripes = overlay.querySelectorAll('[data-intro-stripe]');
  const destination = site.querySelector<HTMLElement>('[data-intro-destination]')!;
  const content = select('[data-intro-reveal], [data-intro-line]');
  const timeline = gsap.timeline({ paused: true, onComplete, defaults: { ease: 'power3.out' } });

  if (simple) {
    // Returning visitors and reduced motion: no translations, scale or stagger.
    gsap.set(overlay, { autoAlpha: 0 });
    timeline.fromTo(content, { opacity: 0 }, { opacity: 1, duration: introConfig.fadeDuration });
    return timeline;
  }

  const mobile = window.matchMedia('(max-width: 640px)').matches;
  const duration = mobile ? introConfig.mobileDuration : introConfig.desktopDuration;
  const at = (seconds: number) => seconds * duration / 3.8;
  const travel = () => {
    const rect = destination.getBoundingClientRect();
    return { x: rect.left + rect.width / 2 - innerWidth / 2, y: rect.top + rect.height / 2 - innerHeight / 2 };
  };
  gsap.set(overlay, { autoAlpha: 1 });
  gsap.set(symbol, { opacity: 0, scale: .72, transformOrigin: '50% 50%' });
  gsap.set(stripes, { opacity: 0, scaleX: .15, transformOrigin: '50% 50%' });
  gsap.set(content, { opacity: 0, willChange: 'transform, opacity' });
  gsap.set(select('[data-intro-line]'), { yPercent: 110 });
  gsap.set(select('[data-intro-reveal="nav"]'), { y: -15 });
  gsap.set(select('[data-intro-reveal="eyebrow"], [data-intro-reveal="subtitle"], [data-intro-reveal="cta"]'), { y: 16 });
  gsap.set(destination, { opacity: 0 });

  timeline.to(symbol, { opacity: 1, scale: 1, duration: at(.65) }, at(.15))
    .to(stripes, { opacity: 1, scaleX: 1, duration: at(.5), stagger: at(.12) }, at(.38))
    .to(disc, { opacity: 0, duration: at(.4) }, at(1.2))
    .to(stripes, { fill: '#ffffff', duration: at(.4) }, at(1.2))
    .to(aperture, { attr: { r: () => Math.hypot(innerWidth, innerHeight) * .56 }, duration: at(1.6), ease: 'power3.inOut' }, at(1.2))
    .to(symbol, { x: () => travel().x, y: () => travel().y, scale: () => destination.getBoundingClientRect().width / 128, duration: at(1.25), ease: 'power3.inOut' }, at(1.5))
    // Reconstitute the same brand disc as the symbol reaches its permanent home.
    .to(disc, { opacity: 1, duration: at(.4) }, at(2.3))
    .to(stripes, { fill: '#000000', duration: at(.4) }, at(2.3))
    .to(select('[data-intro-reveal="nav"]'), { opacity: 1, y: 0, duration: at(.55) }, at(2.65))
    .to(select('[data-intro-reveal="eyebrow"]'), { opacity: 1, y: 0, duration: at(.45) }, at(2.8))
    .to(select('[data-intro-line]'), { opacity: 1, yPercent: 0, duration: at(.65), stagger: at(.12) }, at(2.9))
    .to(select('[data-intro-reveal="subtitle"]'), { opacity: 1, y: 0, duration: at(.5) }, at(3.12))
    .to(select('[data-intro-reveal="cta"]'), { opacity: 1, y: 0, duration: at(.45) }, at(3.3))
    .to(select('[data-intro-reveal="details"]'), { opacity: 1, duration: at(.4) }, at(3.4))
    .to(overlay.querySelector('[data-intro-skip]'), { opacity: 0, duration: at(.2) }, at(2.5))
    .set(destination, { opacity: 1 }, at(2.76))
    .set(symbol, { opacity: 0 }, at(2.76))
    .set(overlay, { autoAlpha: 0 }, duration);
  return timeline;
}
