import { views } from './views.js';
import { help } from './help.js';

const $ = (id) => document.getElementById(id);
const ga = (el, n, cb) => $(el).addEventListener(n, cb);

const touch = matchMedia('(hover: none)');

let path = [{ view: 'model', arg: null, label: 'GPT' }];
let armed = null;

const hideTip = () => {
  $('tip').style.display = 'none';
  armed = null;
};

const showTip = (el) => {
  const tip = $('tip');
  tip.replaceChildren(...help[el.dataset.help].map((t) => Object.assign(document.createElement('p'), { textContent: t })));
  if (touch.matches && el.classList.contains('link')) {
    tip.append(Object.assign(document.createElement('p'), { textContent: 'Tap again to zoom in.', className: 'hint' }));
  }
  tip.classList.toggle('sheet', touch.matches);
  tip.style.display = 'block';
};

const moveTip = (e) => {
  const tip = $('tip');
  const x = Math.min(e.clientX + 16, innerWidth - tip.offsetWidth - 8);
  const below = e.clientY + 16 + tip.offsetHeight < innerHeight;
  tip.style.left = `${Math.max(8, x)}px`;
  tip.style.top = `${below ? e.clientY + 16 : e.clientY - 16 - tip.offsetHeight}px`;
};

const render = () => {
  hideTip();
  const { viewBox, svg, scroll } = views[path.at(-1).view](path.at(-1).arg);
  const [, , vw, vh] = viewBox.split(' ');
  $('stage').setAttribute('viewBox', viewBox);
  $('stage').style.cssText = scroll ? `width:${vw}px;height:${vh}px;display:block;margin:0 auto` : '';
  $('stage').parentElement.classList.toggle('scroll', !!scroll);
  $('stage').innerHTML = svg;
  $('crumbs').innerHTML = path
    .map((p, i) => `<button data-i="${i}" ${i === path.length - 1 ? 'disabled' : ''}>${p.label}</button>`)
    .join('<span class="sep">›</span>');
};

ga('stage', 'mousemove', (e) => {
  if (touch.matches) return;
  const el = e.target.closest('[data-help]');
  if (!el || !help[el.dataset.help]) return hideTip();
  if ($('tip').style.display !== 'block' || armed !== el) {
    armed = el;
    showTip(el);
  }
  moveTip(e);
});

ga('stage', 'mouseleave', () => {
  if (!touch.matches) hideTip();
});

ga('stage', 'click', (e) => {
  const el = e.target.closest('[data-help], .link');
  if (!el) return hideTip();
  if (touch.matches && help[el.dataset.help] && armed !== el) {
    showTip(el);
    armed = el;
    return;
  }
  if (!el.classList.contains('link')) return;
  path.push({ view: el.dataset.view, arg: el.dataset.arg, label: el.dataset.label });
  render();
});

ga('crumbs', 'click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  path = path.slice(0, +b.dataset.i + 1);
  render();
});

render();
