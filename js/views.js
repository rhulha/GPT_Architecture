import { config as c } from './config.js';
import { box, trap, circle, arrow, path, text } from './svg.js';

const model = () => {
  const cx = 400, bw = 360, bx = cx - bw / 2;
  let s = box({ x: bx, y: 20, w: bw, h: 50, title: 'token indices', sub: '(T)' });
  s += arrow(cx, 70, 290, 110) + arrow(cx, 70, 550, 110);
  s += box({ x: 110, y: 110, w: 270, h: 64, kind: 'op', title: 'token embedding', sub: 'vocab_size → 384' });
  s += box({ x: 420, y: 110, w: 270, h: 64, kind: 'op', title: 'position embedding', sub: '256 → 384' });
  s += arrow(245, 174, 385, 210) + arrow(555, 174, 415, 210);
  s += circle(cx, 225, '+');
  s += arrow(cx, 243, cx, 265);
  for (let i = 0; i < c.nLayer; i++) {
    const y = 265 + i * 62;
    s += box({ x: bx, y, w: bw, h: 48, kind: 'op', title: `Block ${i + 1}`, sub: 'self-attention + feed-forward', go: ['block', i, `Block ${i + 1}`] });
    if (i < c.nLayer - 1) s += arrow(cx, y + 48, cx, y + 62);
  }
  s += arrow(cx, 625, cx, 655);
  s += box({ x: bx, y: 655, w: bw, h: 48, kind: 'op', title: 'ln_f', sub: 'final LayerNorm' });
  s += arrow(cx, 703, cx, 735);
  s += box({ x: bx, y: 735, w: bw, h: 48, kind: 'op', title: 'lm_head', sub: 'Linear 384 → vocab_size', go: ['linear', '384,vocab_size,1', 'lm_head'] });
  s += arrow(cx, 783, cx, 815);
  s += box({ x: bx, y: 815, w: bw, h: 50, title: 'logits', sub: '(T, vocab_size)' });
  return { viewBox: '0 0 800 885', svg: s };
};

const block = () => {
  const cx = 420, w = 300, bx = cx - w / 2, rx = 180;
  let s = box({ x: bx, y: 20, w, h: 50, title: 'x', sub: '(T, 384)' });
  s += arrow(cx, 70, cx, 110);
  s += box({ x: bx, y: 110, w, h: 48, kind: 'op', title: 'ln1', sub: 'LayerNorm' });
  s += arrow(cx, 158, cx, 200);
  s += box({ x: bx, y: 200, w, h: 60, kind: 'op', title: 'MultiHeadAttention', sub: `${c.nHead} heads`, go: ['mha', null, 'MultiHeadAttention'] });
  s += arrow(cx, 260, cx, 302);
  s += circle(cx, 320, '+');
  s += path(`M${cx} 90 H${rx} V320 H${cx - 18}`) + arrow(rx, 320, cx - 18, 320);
  s += arrow(cx, 338, cx, 380);
  s += box({ x: bx, y: 380, w, h: 48, kind: 'op', title: 'ln2', sub: 'LayerNorm' });
  s += arrow(cx, 428, cx, 470);
  s += box({ x: bx, y: 470, w, h: 60, kind: 'op', title: 'FeedForward', sub: `384 → ${c.ffHidden} → 384`, go: ['ffwd', null, 'FeedForward'] });
  s += arrow(cx, 530, cx, 572);
  s += circle(cx, 590, '+');
  s += path(`M${cx} 355 H${rx} V590 H${cx - 18}`) + arrow(rx, 590, cx - 18, 590);
  s += text(rx - 20, 455, 'residual');
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
  s += trap({ x: cx - 240, y: 100, topW: 300, botW: 480, h: 90, title: 'Linear', sub: `384 → ${c.ffHidden}`, go: ['linear', `384,${c.ffHidden},1`, 'Linear 1'] });
  s += arrow(cx, 190, cx, 230);
  s += box({ x: cx - 240, y: 230, w: 480, h: 48, kind: 'op', title: 'ReLU' });
  s += arrow(cx, 278, cx, 318);
  s += trap({ x: cx - 240, y: 318, topW: 480, botW: 300, h: 90, title: 'Linear', sub: `${c.ffHidden} → 384`, go: ['linear', `${c.ffHidden},384,1`, 'Linear 2'] });
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

export const views = { model, block, mha, ffwd, head, linear };
