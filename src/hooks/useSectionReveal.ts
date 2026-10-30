import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const sceneSelector = '#services, #cases, #methodology, #faq, #contact';
const groupSelector = '.section-heading, .faq-intro, .contact-intro, .service-tools, .result-count, .service-card, .services-note, .case-selector, .case-showcase, .case-invitation, .method-steps, .method-detail, .method-footer, .faq-item, .contact-form-panel, .footer-main, .footer-bottom';

/** A single owner for native-scroll reveals, ambient motion and their cleanup. */
export function useSectionReveal() {
  useEffect(() => {
    const site = document.querySelector<HTMLElement>('.alpha-site');
    if (!site) return;
    const revealed = new WeakSet<Element>();
    let media: gsap.MatchMedia | undefined;
    let frame = 0;
    let disposed = false;
    let resizeObserver: ResizeObserver | undefined;
    let mutationObserver: MutationObserver | undefined;
    const refresh = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => { if (!disposed && media) ScrollTrigger.refresh(); });
    };

    const start = () => {
      if (media || disposed) return;
      media = gsap.matchMedia();
      media.add({ mobile: '(max-width: 767px)', desktop: '(min-width: 768px)', reduced: '(prefers-reduced-motion: reduce)' }, match => {
        const { mobile, reduced } = match.conditions!;
        const registered = new WeakSet<Element>();
        const pending = new Map<HTMLElement, () => void>();
        const context = gsap.context(() => {}, site);
        const setupGroups = () => context.add(() => {
          pending.forEach((cleanup, group) => { if (!group.isConnected) { cleanup(); pending.delete(group); } });
          site.querySelectorAll<HTMLElement>(groupSelector).forEach(group => {
            if (registered.has(group)) return;
            registered.add(group);
            // Restored positions and hash links must remain immediately readable.
            if (revealed.has(group) || group.getBoundingClientRect().top < innerHeight * .88) {
              revealed.add(group);
              return;
            }
            const timeline = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
            const heading = group.querySelectorAll('.scene-line');
            const description = group.querySelectorAll(':scope > p:not(.case-industry), .service-benefit, .case-narrative');
            const label = group.querySelectorAll('.service-card-top, .case-industry, .case-visual-header');
            const cta = group.querySelectorAll('.service-card-actions, :scope > .button, :scope > .text-link');
            const artwork = group.querySelectorAll('.service-media, .case-showcase-art, .method-illustration');
            const staged = heading.length || artwork.length;
            if (reduced) {
              timeline.fromTo(group, { opacity: 0 }, { opacity: 1, duration: .18 });
            } else {
              timeline.fromTo(group, { opacity: 0, y: staged ? 0 : (mobile ? 14 : 24) }, { opacity: 1, y: 0, duration: .45 }, 0);
              if (artwork.length) timeline.fromTo(artwork, { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: .8 }, 0);
              if (label.length) timeline.fromTo(label, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .4 }, .12);
              if (heading.length) timeline.fromTo(heading, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: mobile ? .55 : .72, stagger: .08 }, .18);
              if (description.length) timeline.fromTo(description, { opacity: 0, y: mobile ? 16 : 30 }, { opacity: 1, y: 0, duration: .5 }, .38);
              if (cta.length) timeline.fromTo(cta, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .4 }, .58);
            }
            const reveal = () => { revealed.add(group); timeline.play(); };
            const trigger = ScrollTrigger.create({ id: 'alpha-reveal', trigger: group, start: mobile ? 'top 93%' : 'top 88%', once: true, onEnter: reveal, onEnterBack: reveal });
            // Keyboard navigation should never land on an invisible control.
            const focus = () => { revealed.add(group); timeline.progress(1); };
            group.addEventListener('focusin', focus);
            // Store cleanup inside the GSAP context, including dynamically added cards.
            pending.set(group, () => { trigger.kill(); timeline.kill(); group.removeEventListener('focusin', focus); });
          });
        });
        context.add(() => {
          site.querySelectorAll<HTMLElement>(sceneSelector).forEach(scene => {
            const background = scene.querySelector('.scene-backdrop');
            const depth = scene.querySelector('.scene-depth');
            const inView = scene.getBoundingClientRect().top < innerHeight * .95;
            if (background && !inView && !revealed.has(scene)) {
              gsap.fromTo(background, { opacity: 0, scale: reduced ? 1 : 1.06 }, {
                opacity: 1, scale: 1, duration: reduced ? .18 : 1.1, ease: 'power2.out',
                scrollTrigger: { id: 'alpha-background', trigger: scene, start: 'top 98%', once: true, onEnter: () => { revealed.add(scene); } },
              });
            }
            if (depth && !mobile && !reduced) gsap.fromTo(depth, { yPercent: -3 }, { yPercent: 3, ease: 'none', scrollTrigger: { id: 'alpha-depth', trigger: scene, start: 'top bottom', end: 'bottom top', scrub: .7 } });
            ScrollTrigger.create({ id: 'alpha-ambient', trigger: scene, start: 'top bottom', end: 'bottom top', onToggle: self => scene.classList.toggle('scene-is-active', self.isActive) });
          });
          const hero = site.querySelector('#hero');
          const header = site.querySelector('.site-header');
          if (hero && header) ScrollTrigger.create({ id: 'alpha-nav', trigger: hero, start: 'bottom top+=88', onUpdate: self => header.classList.toggle('is-scrolled', self.progress > 0), onRefresh: self => header.classList.toggle('is-scrolled', self.progress > 0) });
          const cue = site.querySelector('.hero-scroll-cue');
          if (cue) gsap.to(cue, { opacity: 0, ease: 'none', scrollTrigger: { id: 'alpha-cue', start: 0, end: 160, scrub: true } });
        });
        setupGroups();
        mutationObserver = new MutationObserver(() => { setupGroups(); refresh(); });
        mutationObserver.observe(site.querySelector('#main')!, { childList: true, subtree: true });
        resizeObserver = new ResizeObserver(refresh);
        site.querySelectorAll(sceneSelector).forEach(scene => resizeObserver!.observe(scene));
        refresh();
        return () => {
          mutationObserver?.disconnect();
          resizeObserver?.disconnect();
          pending.forEach(cleanup => cleanup());
          pending.clear();
          context.revert();
          site.querySelectorAll('.scene-is-active').forEach(scene => scene.classList.remove('scene-is-active'));
        };
      });
      void document.fonts.ready.then(refresh);
    };
    // Defer past the intro callback: its context.revert() must finish first.
    const afterIntro = () => {
      frame = requestAnimationFrame(() => {
        start();
        // React mounts after the browser first attempts to resolve a fragment.
        // Reapply the native anchor once the intro has released the document.
        const anchor = location.hash && document.getElementById(location.hash.slice(1));
        if (anchor) anchor.scrollIntoView({ behavior: 'instant' });
      });
    };
    if (site.dataset.introState === 'complete') afterIntro();
    else window.addEventListener('alpha:intro-complete', afterIntro, { once: true });
    window.addEventListener('pageshow', refresh);
    return () => {
      disposed = true;
      window.removeEventListener('alpha:intro-complete', afterIntro);
      window.removeEventListener('pageshow', refresh);
      media?.revert();
      cancelAnimationFrame(frame);
      site.querySelector('.site-header')?.classList.remove('is-scrolled');
    };
  }, []);
}
