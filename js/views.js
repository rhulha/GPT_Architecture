import { config as c } from './config.js';
import { box, trap, circle, arrow, path, text } from './svg.js';

const model = () => {
  const cx = 400, bw = 360, bx = cx - bw / 2;
  let s = box({ x: bx, y: 20, w: bw, h: 50, title: 'token indices', sub: '(T)', help: 'token indices' });
  s += arrow(cx, 70, 290, 110) + arrow(cx, 70, 550, 110);
  s += box({ x: 110, y: 110, w: 270, h: 64, kind: 'op', title: 'token embedding', sub: 'vocab_size → 384', help: 'token embedding' });
  s += box({ x: 420, y: 110, w: 270, h: 64, kind: 'op', title: 'position embedding', sub: '256 → 384', help: 'position embedding' });
  s += arrow(245, 174, 385, 210) + arrow(555, 174, 415, 210);
  s += circle(cx, 225, '+', '+ (add)');
  s += arrow(cx, 243, cx, 265);
  for (let i = 0; i < c.nLayer; i++) {
    const y = 265 + i * 62;
    s += box({ x: bx, y, w: bw, h: 48, kind: 'op', title: `Block ${i + 1}`, sub: 'self-attention + feed-forward', go: ['block', i, `Block ${i + 1}`], help: 'Block 1 to Block 6' });
    if (i < c.nLayer - 1) s += arrow(cx, y + 48, cx, y + 62);
  }
  s += arrow(cx, 625, cx, 655);
  s += box({ x: bx, y: 655, w: bw, h: 48, kind: 'op', title: 'ln_f', sub: 'final LayerNorm', go: ['layernorm', null, 'ln_f'], help: 'ln_f' });
  s += arrow(cx, 703, cx, 735);
  s += box({ x: bx, y: 735, w: bw, h: 48, kind: 'op', title: 'lm_head', sub: 'Linear 384 → vocab_size', go: ['linear', '384,vocab_size,1', 'lm_head'], help: 'lm_head' });
  s += arrow(cx, 783, cx, 815);
  s += box({ x: bx, y: 815, w: bw, h: 50, title: 'logits', sub: '(T, vocab_size)', help: 'logits' });
  return { viewBox: '0 0 800 885', svg: s };
};

const block = () => {
  const cx = 420, w = 300, bx = cx - w / 2, rx = 180;
  const residual = (y1, y2) => {
    const d = `M${cx} ${y1} H${rx} V${y2} H${cx - 18}`, mid = (y1 + y2) / 2;
    return `<g data-help="residual"><path class="hit" d="${d}"/><path class="residual" d="${d}"/>` +
      `<circle class="residual-head" cx="${cx}" cy="${y1}" r="5"/>` +
      `<polygon class="residual-head" points="${cx - 18},${y2} ${cx - 31},${y2 - 8} ${cx - 31},${y2 + 8}"/>` +
      `<text class="title cyan-text" x="${rx - 26}" y="${mid}" transform="rotate(-90 ${rx - 26} ${mid})">residual connection</text></g>`;
  };
  let s = box({ x: bx, y: 20, w, h: 50, title: 'x', sub: '(T, 384)' });
  s += arrow(cx, 70, cx, 110);
  s += box({ x: bx, y: 110, w, h: 48, kind: 'op', title: 'ln1', sub: 'LayerNorm', go: ['layernorm', null, 'ln1'], help: 'LayerNorm' });
  s += arrow(cx, 158, cx, 200);
  s += box({ x: bx, y: 200, w, h: 60, kind: 'op', title: 'MultiHeadAttention', sub: `${c.nHead} heads`, go: ['mha', null, 'MultiHeadAttention'] });
  s += arrow(cx, 260, cx, 302);
  s += circle(cx, 320, '+');
  s += residual(90, 320);
  s += arrow(cx, 338, cx, 380);
  s += box({ x: bx, y: 380, w, h: 48, kind: 'op', title: 'ln2', sub: 'LayerNorm', go: ['layernorm', null, 'ln2'], help: 'LayerNorm' });
  s += arrow(cx, 428, cx, 470);
  s += box({ x: bx, y: 470, w, h: 60, kind: 'op', title: 'FeedForward', sub: `384 → ${c.ffHidden} → 384`, go: ['ffwd', null, 'FeedForward'], help: 'FeedForward' });
  s += arrow(cx, 530, cx, 572);
  s += circle(cx, 590, '+');
  s += residual(355, 590);
  s += arrow(cx, 608, cx, 640);
  s += box({ x: bx, y: 640, w, h: 50, title: 'x', sub: '(T, 384)' });
  return { viewBox: '0 0 840 710', svg: s };
};

const mha = () => {
  const hw = 120, gap = 20, x0 = 40, total = c.nHead * hw + (c.nHead - 1) * gap;
  const cx = x0 + total / 2;
  let s = box({ x: x0, y: 20, w: total, h: 50, title: 'x', sub: '(T, 384)' });
  for (let i = 0; i < c.nHead; i++) {
    const x = x0 + i * (hw + gap), hc = x + hw / 2;
    s += arrow(cx, 70, hc, 150);
    s += box({ x, y: 150, w: hw, h: 70, kind: 'op', title: `Head ${i + 1}`, sub: `T × ${c.headSize}`, go: ['head', i, `Head ${i + 1}`] });
    s += arrow(hc, 220, cx, 300);
  }
  s += box({ x: x0, y: 300, w: total, h: 50, title: 'concat', sub: `${c.nHead} × ${c.headSize} = ${c.nEmbd}` });
  s += arrow(cx, 350, cx, 390);
  s += box({ x: cx - 200, y: 390, w: 400, h: 50, kind: 'op', title: 'proj', sub: 'Linear 384 → 384', go: ['linear', '384,384,1', 'proj'] });
  s += arrow(cx, 440, cx, 470);
  s += box({ x: cx - 200, y: 470, w: 400, h: 50, title: 'output', sub: '(T, 384)' });
  return { viewBox: '0 0 900 540', svg: s };
};

const ffwd = () => {
  const cx = 400;
  let s = box({ x: cx - 150, y: 20, w: 300, h: 50, title: 'x', sub: '(T, 384)' });
  s += arrow(cx, 70, cx, 100);
  s += trap({ x: cx - 240, y: 100, topW: 300, botW: 480, h: 90, title: 'Linear', sub: `384 → ${c.ffHidden}`, go: ['linear', `384,${c.ffHidden},1`, 'Linear 1'], help: 'ffwd expand' });
  s += arrow(cx, 190, cx, 230);
  s += box({ x: cx - 240, y: 230, w: 480, h: 48, kind: 'op', title: 'ReLU', help: 'ReLU' });
  s += arrow(cx, 278, cx, 318);
  s += trap({ x: cx - 240, y: 318, topW: 480, botW: 300, h: 90, title: 'Linear', sub: `${c.ffHidden} → 384`, go: ['linear', `${c.ffHidden},384,1`, 'Linear 2'], help: 'ffwd shrink' });
  s += arrow(cx, 408, cx, 448);
  s += box({ x: cx - 150, y: 448, w: 300, h: 50, title: 'output', sub: '(T, 384)' });
  return { viewBox: '0 0 800 520', svg: s };
};

const shades = ['#9283e0', '#8577d0', '#6f62ab', '#5f5496', '#6a5da4'];

const triMatrix = (x, y) => {
  let s = `<rect class="matrix" x="${x}" y="${y}" width="340" height="340" rx="10"/>`;
  for (let i = 0; i < 8; i++)
    for (let j = 0; j <= i; j++)
      s += `<rect x="${x + 13 + j * 40}" y="${y + 13 + i * 40}" width="34" height="34" rx="4" fill="${shades[(i * 7 + j * 13 + (i === j ? 0 : 1)) % 5]}"/>`;
  return s;
};

const rot = (cx, cy, deg, cls, str) =>
  `<text class="${cls}" x="${cx}" y="${cy}" transform="rotate(${deg} ${cx} ${cy})">${str}</text>`;

const poly = (pts) => `<polygon class="op" points="${pts.map((p) => p.join(',')).join(' ')}"/>`;

const head = () => {
  const cx = 570, mx = 400, m1y = 332, m2y = 860, hs = c.headSize, e = c.nEmbd;
  let s = '<g class="big">';

  s += `<rect class="data" x="250" y="30" width="640" height="70" rx="12"/>`;
  s += text(cx, 56, 'T embeddings', 'title') + text(cx, 84, `each ${e} numbers`, 'sub');
  s += `<g class="link" data-view="linear" data-arg="${e},${hs},0" data-label="Key matrix">`;
  s += arrow(cx, 100, cx, 118);
  s += poly([[250, 120], [890, 120], [740, 270], [400, 270]]);
  s += '</g>';
  s += text(cx, 168, 'key matrix', 'title') + text(cx, 200, `${e} → ${hs}`, 'sub') + text(cx, 232, `T times ${hs} values`, 'sub teal');
  s += `<rect class="cyan-box" x="${mx}" y="280" width="340" height="40"/>`;
  s += text(cx, 300, 'key vector', 'sub cyan-text');

  s += triMatrix(mx, m1y);
  s += text(cx, 706, 'attention weights', 'title');
  s += text(cx, 738, 'q•k = TxT → mask → softmax', 'sub');

  s += `<rect class="cyan-box" x="752" y="${m1y}" width="40" height="340"/>`;
  s += rot(772, 502, 90, 'sub cyan-text', 'query vector');
  s += `<g class="link" data-view="linear" data-arg="${e},${hs},0" data-label="Query matrix">`;
  s += poly([[804, 332], [954, 182], [954, 822], [804, 672]]);
  s += text(889, 440, 'query', 'title') + text(889, 472, 'matrix', 'title') + text(889, 506, `${e} → ${hs}`, 'sub');
  s += text(889, 556, 'T times', 'sub teal') + text(889, 584, `${hs} values`, 'sub teal');
  s += '</g>';
  s += arrow(984, 502, 956, 502);
  s += `<rect class="data" x="984" y="182" width="70" height="640" rx="12"/>`;
  s += rot(1030, 502, 90, 'title', 'T embeddings') + rot(1004, 502, 90, 'sub', `each ${e} numbers`);

  s += arrow(cx, 770, cx, 840);

  s += `<rect class="cyan-box" x="348" y="${m2y}" width="40" height="340"/>`;
  s += rot(368, 1030, 90, 'sub cyan-text', 'value vector');
  s += `<g class="link" data-view="linear" data-arg="${e},${hs},0" data-label="Value matrix">`;
  s += poly([[336, 860], [186, 710], [186, 1350], [336, 1200]]);
  s += text(251, 968, 'value', 'title') + text(251, 1000, 'matrix', 'title') + text(251, 1034, `${e} → ${hs}`, 'sub');
  s += text(251, 1084, 'T times', 'sub teal') + text(251, 1112, `${hs} values`, 'sub teal');
  s += '</g>';
  s += arrow(156, 1030, 184, 1030);
  s += `<rect class="data" x="86" y="710" width="70" height="640" rx="12"/>`;
  s += rot(132, 1030, -90, 'title', 'T embeddings') + rot(106, 1030, -90, 'sub', `each ${e} numbers`);

  s += triMatrix(mx, m2y);
  s += text(cx, 1234, 'weights @ v', 'title');
  s += text(cx, 1266, 'attention matrix multiplication', 'sub teal') + text(cx, 1294, 'with value vector', 'sub teal');
  s += arrow(cx, 1308, cx, 1338);

  s += `<rect class="data" x="${mx}" y="1340" width="340" height="80" rx="12"/>`;
  s += text(cx, 1366, 'output', 'title') + text(cx, 1398, `T times ${hs} values`, 'sub teal');
  return { viewBox: '60 0 1020 1450', svg: s + '</g>' };
};

const weightImage = (w, h) => {
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  const ctx = cv.getContext('2d');
  const img = ctx.createImageData(w, h);
  const [r0, g0, b0] = [0x2b, 0x28, 0x42], [r1, g1, b1] = [0x92, 0x83, 0xe0];
  let seed = 1337;
  const rnd = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let k = 0; k < w * h; k++) {
    const v = (rnd() + rnd()) / 2;
    img.data.set([r0 + (r1 - r0) * v, g0 + (g1 - g0) * v, b0 + (b1 - b0) * v, 255], k * 4);
  }
  ctx.putImageData(img, 0, 0);
  return cv.toDataURL();
};

const linear = (arg) => {
  const [i, o] = arg.split(',');
  const nIn = Number(i) || 384, nOut = Number(o) || 65;
  const total = Math.max(nOut + 220, 760), x = (total - nOut) / 2, y = 90;
  const outLabel = `${nOut} outputs` + (Number.isNaN(Number(o)) ? ' (vocab_size)' : '');
  let s = '<g class="big">';
  s += `<rect class="matrix" x="${x - 3}" y="${y - 3}" width="${nOut + 6}" height="${nIn + 6}" rx="3"/>`;
  s += `<image href="${weightImage(nOut, nIn)}" x="${x}" y="${y}" width="${nOut}" height="${nIn}" style="image-rendering: pixelated"/>`;
  s += text(x + nOut / 2, y - 30, outLabel, 'title');
  s += rot(x - 40, y + nIn / 2, -90, 'title', `${nIn} inputs`);
  s += text(x + nOut / 2, y + nIn + 40, `weight matrix W: ${nIn} × ${nOut} learned numbers, one pixel each`, 'sub teal');
  return { viewBox: `0 0 ${total} ${y + nIn + 80}`, svg: s + '</g>', scroll: true };
};

const makeRng = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const gauss = (rnd) => Math.sqrt(-2 * Math.log(1 - rnd())) * Math.cos(2 * Math.PI * rnd());

const LO = -4, HI = 9;

const barChart = (x, y, w, h, values, { band, line } = {}) => {
  const unit = h / (HI - LO);
  const yOf = (v) => y + (HI - Math.min(HI, Math.max(LO, v))) * unit;
  const y0 = yOf(0), bw = w / values.length;
  let s = `<rect class="matrix" x="${x}" y="${y}" width="${w}" height="${h}" rx="8"/>`;
  if (band) s += `<rect class="band" x="${x}" y="${yOf(band[1])}" width="${w}" height="${(band[1] - band[0]) * unit}"/>`;
  s += `<line class="zero" x1="${x}" y1="${y0}" x2="${x + w}" y2="${y0}"/>`;
  s += `<path class="bar" d="${values.map((v, i) => `M${x + i * bw} ${y0}V${yOf(v)}h${bw}V${y0}z`).join('')}"/>`;
  if (line != null) s += `<line class="meanline" x1="${x}" y1="${yOf(line)}" x2="${x + w}" y2="${yOf(line)}"/>`;
  return { svg: s, yOf };
};

const strip = (x, y, w, h, values, lo, hi) => {
  const cw = w / values.length;
  let s = `<rect class="matrix" x="${x - 3}" y="${y - 3}" width="${w + 6}" height="${h + 6}" rx="4"/>`;
  values.forEach((v, i) => {
    const t = Math.min(1, Math.max(0, (v - lo) / (hi - lo)));
    const col = `rgb(${Math.round(0x2b + (0x92 - 0x2b) * t)},${Math.round(0x28 + (0x83 - 0x28) * t)},${Math.round(0x42 + (0xe0 - 0x42) * t)})`;
    s += `<rect x="${x + i * cw}" y="${y}" width="${cw}" height="${h}" fill="${col}"/>`;
  });
  return s;
};

const layernorm = () => {
  const n = c.nEmbd, cx = 464, x0 = 80, w = 768, hc = 182;
  const rnd = makeRng(42);
  const raw = Array.from({ length: n }, () => 3 + 1.8 * gauss(rnd));
  const mu = raw.reduce((a, b) => a + b, 0) / n;
  const sigma = Math.sqrt(raw.reduce((a, b) => a + (b - mu) ** 2, 0) / n);
  const norm = raw.map((v) => (v - mu) / sigma);
  const gamma = Array.from({ length: n }, () => 1 + 0.25 * gauss(rnd));
  const beta = Array.from({ length: n }, () => 0.3 * gauss(rnd));
  const out = norm.map((v, i) => gamma[i] * v + beta[i]);
  const grp = (key, inner) => `<g data-help="${key}">${inner}</g>`;

  let s = '<defs><pattern id="ln-cells" width="16" height="16" patternUnits="userSpaceOnUse"><rect x="1" y="1" width="14" height="14" rx="3" fill="#6f62ab"/></pattern></defs><g class="big">';

  s += grp('layernorm input',
    `<rect class="matrix" x="296" y="24" width="336" height="144" rx="8"/>` +
    `<rect x="304" y="32" width="320" height="128" fill="url(#ln-cells)"/>` +
    `<rect class="cyan-box" x="300" y="78" width="328" height="20"/>` +
    text(190, 80, 'x', 'title') + text(190, 112, `T × ${n}`, 'sub teal') +
    text(790, 66, 'one row = one token', 'sub cyan-text') + text(790, 94, `its ${n} numbers`, 'sub cyan-text') + text(790, 122, 'are normalized on their own', 'sub cyan-text'));
  s += arrow(cx, 168, cx, 198);

  const c1 = barChart(x0, 228, w, hc, raw, { band: [mu - sigma, mu + sigma], line: mu });
  s += grp('layernorm raw', text(cx, 214, `x: the ${n} numbers of one token`, 'sub teal') + c1.svg +
    text(878, c1.yOf(mu), 'μ', 'title cyan-text') + text(878, c1.yOf(0) + 4, '0', 'sub') + text(878, c1.yOf(mu + sigma) - 14, '±σ', 'sub cyan-text'));

  s += arrow(cx, 410, cx, 452);
  const c2 = barChart(x0, 488, w, hc, norm, { band: [-1, 1] });
  s += grp('layernorm normalized', text(250, 432, 'μ = average, σ = spread', 'sub') + text(710, 432, 'x̂ = (x − μ) / √(σ² + ε)', 'title') +
    text(cx, 474, 'x̂: average 0, spread 1', 'sub teal') + c2.svg + text(878, c2.yOf(0), '0', 'sub') + text(878, c2.yOf(1) - 14, '±1', 'sub cyan-text'));

  s += arrow(cx, 670, cx, 702);
  s += grp('layernorm gamma', text(cx, 724, `γ scale: ${n} learned numbers (start at 1)`, 'sub teal') + strip(x0, 748, w, 24, gamma, 0.4, 1.6));
  s += grp('layernorm beta', text(cx, 790, `β shift: ${n} learned numbers (start at 0)`, 'sub teal') + strip(x0, 814, w, 24, beta, -0.8, 0.8));

  s += arrow(cx, 844, cx, 874);
  const c3 = barChart(x0, 904, w, hc, out);
  s += grp('layernorm output', text(250, 686, 'γ and β are learned', 'sub') + text(710, 686, 'y = γ · x̂ + β', 'title') +
    text(cx, 890, 'y: the output', 'sub teal') + c3.svg + text(878, c3.yOf(0), '0', 'sub') + text(cx, 1118, `${n} numbers, the same shape as the input`, 'sub teal'));
  return { viewBox: '0 0 960 1150', svg: s + '</g>' };
};

export const views = { model, block, mha, ffwd, head, linear, layernorm };
