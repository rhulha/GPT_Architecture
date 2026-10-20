import { views } from './views.js';

const $ = (id) => document.getElementById(id);

let path = [{ view: 'model', arg: null, label: 'GPT' }];

const render = () => {
  const { viewBox, svg } = views[path.at(-1).view](path.at(-1).arg);
  $('stage').setAttribute('viewBox', viewBox);
  $('stage').innerHTML = svg;
  $('crumbs').innerHTML = path
    .map((p, i) => `<button data-i="${i}" ${i === path.length - 1 ? 'disabled' : ''}>${p.label}</button>`)
    .join('<span class="sep">›</span>');
};

$('stage').addEventListener('click', (e) => {
  const g = e.target.closest('.link');
  if (!g) return;
  path.push({ view: g.dataset.view, arg: g.dataset.arg, label: g.dataset.label });
  render();
});

$('crumbs').addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  path = path.slice(0, +b.dataset.i + 1);
  render();
});

render();
