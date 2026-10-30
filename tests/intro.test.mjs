import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import ts from 'typescript';
import { JSDOM } from 'jsdom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

// Compile the actual components in memory, without a second generated source tree.
registerHooks({
  resolve(specifier, context, next) {
    if (specifier.startsWith('.') && context.parentURL?.includes('/src/')) {
      for (const extension of ['.ts', '.tsx']) {
        const url = new URL(specifier + extension, context.parentURL);
        if (existsSync(url)) return next(url.href, context);
      }
    }
    return next(specifier, context);
  },
  load(url, context, next) {
    if (/\/src\/.*\.tsx?$/.test(url)) return {
      format: 'module', shortCircuit: true,
      source: ts.transpileModule(readFileSync(new URL(url), 'utf8'), {
        compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2023 },
      }).outputText,
    };
    return next(url, context);
  },
});

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'http://localhost/', pretendToBeVisual: true });
const { window } = dom;
for (const key of ['window', 'document', 'HTMLElement', 'SVGElement', 'Event', 'KeyboardEvent', 'sessionStorage', 'location']) globalThis[key] = key === 'window' ? window : window[key];
globalThis.getComputedStyle = window.getComputedStyle.bind(window);
globalThis.requestAnimationFrame = window.requestAnimationFrame.bind(window);
globalThis.cancelAnimationFrame = window.cancelAnimationFrame.bind(window);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
globalThis.scrollY = 0;
globalThis.innerWidth = 1440;
globalThis.innerHeight = 900;
window.SVGElement.prototype.getBBox = () => ({ x: 0, y: 0, width: 256, height: 256 });
let mobile = false;
const reduced = new window.EventTarget();
reduced.matches = false;
globalThis.matchMedia = window.matchMedia = query => query.includes('reduced-motion') ? reduced : { matches: mobile };
const { gsap } = await import('gsap');
const { BrandIntro } = await import('../src/components/intro/BrandIntro.tsx');
const { LanguageContext } = await import('../src/context/language.ts');
const { introConfig } = await import('../src/lib/animations/introTimeline.ts');
const element = React.createElement;

function Fixture() {
  return element(LanguageContext.Provider, { value: { lang: 'es' } },
    element('div', { className: 'alpha-site' },
      element(BrandIntro),
      element('header', { 'data-intro-reveal': 'nav' }, element('a', { className: 'brand-home', href: '#hero' }, 'ALPHA')),
      element('main', null,
        element('div', { 'data-intro-line': true }, 'La transformación'),
        ...['eyebrow', 'subtitle', 'cta', 'details'].map(value => element('div', { key: value, 'data-intro-reveal': value }, value)),
        element('img', { 'data-intro-destination': true, alt: '' }))));
}

async function mount({ seen = false, motion = false, width = 1440, hash = '', strict = false, storageBlocked = false } = {}) {
  sessionStorage.clear();
  if (seen) sessionStorage.setItem(introConfig.storageKey, 'true');
  reduced.matches = motion;
  mobile = width <= 640;
  globalThis.innerWidth = width;
  location.hash = hash;
  const root = createRoot(document.getElementById('root'));
  const storageDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'sessionStorage');
  if (storageBlocked) Object.defineProperty(globalThis, 'sessionStorage', { configurable: true, get() { throw new Error('blocked'); } });
  await act(() => root.render(strict ? element(React.StrictMode, null, element(Fixture)) : element(Fixture)));
  const site = document.querySelector('.alpha-site');
  const timeline = gsap.globalTimeline.getChildren().find(animation => animation instanceof gsap.core.Timeline);
  assert.ok(timeline, 'A single live intro timeline exists');
  return { site, timeline, async dispose() {
    await act(() => root.unmount());
    if (storageBlocked) Object.defineProperty(globalThis, 'sessionStorage', storageDescriptor);
    assert.equal(gsap.globalTimeline.getChildren().length, 0, 'All GSAP animations are cleaned up');
  } };
}

async function finish(fixture) {
  await act(() => fixture.timeline.progress(1));
  assert.equal(fixture.site.dataset.introState, 'complete');
  assert.notEqual(document.documentElement.style.overflow, 'hidden');
  assert.equal(fixture.site.querySelector('main').inert, undefined);
  assert.equal(fixture.site.querySelector('[data-intro-line]').getAttribute('style') || '', '');
}

test('first visit opens the real page, restores scroll, persists session, and cleans React StrictMode effects', async () => {
  const fixture = await mount({ strict: true });
  assert.equal(fixture.site.dataset.introState, 'playing');
  assert.equal(document.documentElement.style.overflow, 'hidden');
  assert.equal(fixture.site.querySelector('main').inert, true);
  assert.equal(fixture.timeline.duration(), 3.8);
  fixture.timeline.time(2);
  assert.ok(Number(fixture.site.querySelector('[data-intro-aperture]').getAttribute('r')) > 0, 'Hero is revealed before the intro ends');
  await finish(fixture);
  assert.equal(sessionStorage.getItem(introConfig.storageKey), 'true');
  const event = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true });
  document.dispatchEvent(event);
  assert.equal(event.defaultPrevented, false, 'Keyboard listener is removed after completion');
  await fixture.dispose();
});

for (const width of [390, 768, 1440]) test(`duration and restoration at ${width}px`, async () => {
  const fixture = await mount({ width });
  assert.equal(fixture.timeline.duration(), width <= 640 ? 2.7 : 3.8);
  await finish(fixture);
  await fixture.dispose();
});

for (const options of [{ seen: true }, { motion: true }, { hash: '#services' }]) test(`micro reveal ${JSON.stringify(options)}`, async () => {
  const fixture = await mount(options);
  assert.equal(fixture.site.dataset.introState, 'fade');
  assert.equal(fixture.timeline.duration(), .4);
  assert.notEqual(document.documentElement.style.overflow, 'hidden');
  await finish(fixture);
  await fixture.dispose();
});

for (const key of ['Enter', ' ', 'Escape', 'click']) test(`skip with ${key} accelerates existing timeline`, async () => {
  const fixture = await mount();
  if (key === 'click') fixture.site.querySelector('.brand-intro').click();
  else document.dispatchEvent(new KeyboardEvent('keydown', { key, cancelable: true }));
  assert.ok(fixture.timeline.timeScale() > 1);
  assert.equal(fixture.site.dataset.introState, 'playing', 'Skip is continuous, not an immediate teardown');
  await finish(fixture);
  await fixture.dispose();
});

test('unmount during intro restores pre-existing scroll styles and kills the timeline', async () => {
  document.documentElement.style.overflow = 'auto';
  document.documentElement.style.scrollbarGutter = 'stable both-edges';
  const fixture = await mount();
  await fixture.dispose();
  assert.equal(document.documentElement.style.overflow, 'auto');
  assert.equal(document.documentElement.style.scrollbarGutter, 'stable both-edges');
  assert.equal(sessionStorage.getItem(introConfig.storageKey), null, 'Interrupted intro is not recorded as seen');
  document.documentElement.removeAttribute('style');
});

test('storage errors do not prevent completion', async () => {
  const fixture = await mount({ storageBlocked: true });
  await finish(fixture);
  await fixture.dispose();
});

test('live reduced-motion preference resolves the animation and releases the page', async () => {
  const fixture = await mount();
  reduced.matches = true;
  await act(() => reduced.dispatchEvent(new Event('change')));
  assert.equal(fixture.site.dataset.introState, 'complete');
  assert.notEqual(document.documentElement.style.overflow, 'hidden');
  await fixture.dispose();
});

test('skip finishes through the live GSAP ticker and emits the Hero readiness event once', async () => {
  const fixture = await mount();
  let ready = 0;
  const onReady = () => ready++;
  window.addEventListener('alpha:intro-complete', onReady);
  await act(async () => {
    fixture.site.querySelector('[data-intro-skip]').click();
    await new Promise(resolve => setTimeout(resolve, 700));
  });
  assert.equal(fixture.site.dataset.introState, 'complete');
  assert.equal(ready, 1);
  window.removeEventListener('alpha:intro-complete', onReady);
  await fixture.dispose();
});

test('resizing recalculates the reveal radius and still releases the page', async () => {
  const fixture = await mount({ width: 390 });
  globalThis.innerWidth = 1440;
  window.dispatchEvent(new Event('resize'));
  fixture.timeline.time(fixture.timeline.duration() * .8);
  const radius = Number(fixture.site.querySelector('[data-intro-aperture]').getAttribute('r'));
  assert.ok(radius >= Math.hypot(1440, 900) / 2, 'Aperture covers the resized viewport');
  await finish(fixture);
  await fixture.dispose();
});

test.after(() => { gsap.ticker.sleep(); dom.window.close(); });
