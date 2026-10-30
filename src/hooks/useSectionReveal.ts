import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const sceneSelector = '#services, #cases, #methodology, #faq, #contact, .site-footer';
const contentSelector = [
  '.section-heading h2', '.section-heading > p', '.faq-intro h2', '.faq-intro > p',
  '.contact-intro h2', '.contact-intro > p',
  '.service-tools', '.result-count', '.service-card', '.services-note',
  '.case-selector', '.case-showcase', '.case-invitation',
  '.method-steps', '.method-detail', '.method-footer', '.faq-item',
  '.contact-channel', '.contact-form-panel', '.footer-main', '.footer-bottom',
].join(',');

/** Set up native-scroll scene reveals only after the full-screen intro has ended. */
export function useSectionReveal() {
  useEffect(() => {
    const site = document.querySelector<HTMLElement>('.alpha-site');
    if (!site) return;
    let context: gsap.Context | undefined;
    let refreshFrame = 0;
    const mediaContexts: gsap.MatchMedia[] = [];

    const start = () => {
      if (context) return;
      const root = site.querySelector<HTMLElement>('#main');
      if (!root) return;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const siteHeader = site.querySelector<HTMLElement>('.site-header');
      const hero = root.querySelector<HTMLElement>('#hero');
      site.classList.toggle('has-scrolled', scrollY > 32);
      if (siteHeader && hero) siteHeader.classList.toggle('is-scrolled', hero.getBoundingClientRect().bottom <= 0);
      context = gsap.context(() => {
        const scenes = [...root.querySelectorAll<HTMLElement>(sceneSelector)];
        const footer = site.querySelector<HTMLElement>('.site-footer');
        if (footer) scenes.push(footer);
        scenes.forEach(scene => {
          const sceneAlreadyInView = scene.getBoundingClientRect().top < innerHeight * .82;
          const targets = reduced || sceneAlreadyInView
            ? []
            : Array.from(scene.querySelectorAll<HTMLElement>(contentSelector)).filter(target => {
                const bounds = target.getBoundingClientRect();
                return bounds.top > innerHeight * .12 && bounds.bottom > innerHeight * .82;
              });

          // A direct link or restored scroll position never hides content already on screen.
          if (targets.length) {
            const timeline = gsap.timeline({ paused: true });
            const heading = targets.filter(target => target.matches('h2'));
            const description = targets.filter(target => target.matches('.section-heading > p, .faq-intro > p, .contact-intro > p'));
            const regular = targets.filter(target => !target.matches('h2, .section-heading > p, .faq-intro > p, .contact-intro > p'));
            timeline.fromTo(heading, { autoAlpha: 0, y: 64 }, { autoAlpha: 1, y: 0, duration: .72, ease: 'power3.out' }, 0)
              .fromTo(description, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: .58, ease: 'power3.out' }, .2)
              .fromTo(regular, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: .55, stagger: .065, ease: 'power3.out' }, .36);
            ScrollTrigger.create({
              trigger: scene,
              start: 'top 82%',
              once: true,
              onEnter: () => timeline.play(0),
            });
          }

          // Keep existing signal illustrations lively only while their scene is nearby.
          ScrollTrigger.create({
            trigger: scene,
            start: 'top bottom',
            end: 'bottom top',
            onToggle: self => scene.classList.toggle('scene-is-active', self.isActive),
          });

          // Give the illustrated case study a restrained depth cue on larger screens.
          const artwork = scene.querySelector<HTMLElement>('.case-visual > svg');
          if (artwork) {
            const media = gsap.matchMedia(scene);
            media.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
              gsap.fromTo(artwork, { yPercent: -2 }, {
                yPercent: 2,
                ease: 'none',
                scrollTrigger: { trigger: scene, start: 'top bottom', end: 'bottom top', scrub: .6 },
              });
            });
            mediaContexts.push(media);
          }
        });

        if (hero && siteHeader) {
          ScrollTrigger.create({
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            onLeave: () => siteHeader.classList.add('is-scrolled'),
            onEnterBack: () => siteHeader.classList.remove('is-scrolled'),
            onLeaveBack: () => siteHeader.classList.remove('is-scrolled'),
          });
          ScrollTrigger.create({
            start: 32,
            onEnter: () => site.classList.add('has-scrolled'),
            onLeaveBack: () => site.classList.remove('has-scrolled'),
          });
        }
      }, root);

      // Resolve dimensions after the intro has released the viewport and restored scroll.
      refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
      void document.fonts?.ready.then(() => { if (context) ScrollTrigger.refresh(); });
    };

    const completed = site.dataset.introState === 'complete';
    if (completed) start();
    else window.addEventListener('alpha:intro-complete', start, { once: true });
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotionChange = () => {
      if (!context) return;
      cancelAnimationFrame(refreshFrame);
      mediaContexts.splice(0).forEach(media => media.revert());
      context.revert();
      context = undefined;
      start();
    };
    motionPreference.addEventListener('change', onMotionChange);

    return () => {
      window.removeEventListener('alpha:intro-complete', start);
      motionPreference.removeEventListener('change', onMotionChange);
      cancelAnimationFrame(refreshFrame);
      mediaContexts.splice(0).forEach(media => media.revert());
      context?.revert();
      site.classList.remove('has-scrolled');
      site.querySelector('.site-header')?.classList.remove('is-scrolled');
      site.querySelectorAll('.scene-is-active').forEach(scene => scene.classList.remove('scene-is-active'));
    };
  }, []);
}
