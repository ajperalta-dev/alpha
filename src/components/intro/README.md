# Intro ALPHA

The existing Hero is mounted throughout. A fullscreen SVG veil opens a circular
window onto it while the exact ALPHA isotipo travels to the existing Hero signature.
One GSAP timeline controls the veil, symbol, navigation and line reveals.

Configuration: `src/lib/animations/introTimeline.ts` exports `introConfig`.

- Desktop/tablet: 3.8 seconds. Mobile (up to 640px): 2.7 seconds.
- Session key: `alpha:hasSeenIntro:v1`. Set `oncePerSession` to `false` to replay on each mount.
- To preview a first visit, remove that sessionStorage key and reload.
- Returning visitors, reduced motion, restored scroll and deep links use a 400ms fade.
- Click, Enter, Space or Escape accelerate the current sequence to finish within 450ms.
- React cleanup and completion both release scroll, restore inert regions, remove
  listeners and revert temporary GSAP styles. Storage access is optional.
- The existing Canvas remains paused until the intro completes.

`npm test` includes DOM integration tests of the actual components with GSAP,
covering first visit, session state, responsive timing, skip, motion preferences,
storage failure, resizing, real ticker completion and StrictMode cleanup.
These tests do not establish visual fidelity, browser layout or a frame-rate guarantee.
The supplied Pinterest reference could not be accessed during implementation;
the motion follows the written brief and existing brand assets.
