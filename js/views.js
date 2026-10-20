import { config as c } from './config.js';
import { box, trap, circle, arrow, path, text } from './svg.js';

const model = () => {
  const cx = 400, bw = 360, bx = cx - bw / 2;
  let s = box({ x: bx, y: 20, w: bw, h: 50, title: 'token indices', sub: '(B, T)' });
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
  s += box({ x: bx, y: 735, w: bw, h: 48, kind: 'op', title: 'lm_head', sub: 'Linear 384 → vocab_size' });
  s += arrow(cx, 783, cx, 815);
  s += box({ x: bx, y: 815, w: bw, h: 50, title: 'logits', sub: '(B, T, vocab_size)' });
  return { viewBox: '0 0 800 885', svg: s };
};

const block = () => {
  const cx = 420, w = 300, bx = cx - w / 2, rx = 180;
  let s = box({ x: bx, y: 20, w, h: 50, title: 'x', sub: '(B, T, 384)' });
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
  s += box({ x: bx, y: 640, w, h: 50, title: 'x', sub: '(B, T, 384)' });
  return { viewBox: '0 0 840 710', svg: s };
};

const mha = () => {
  const hw = 120, gap = 20, x0 = 40, total = c.nHead * hw + (c.nHead - 1) * gap;
  const cx = x0 + total / 2;
  let s = box({ x: x0, y: 20, w: total, h: 50, title: 'x', sub: '(B, T, 384)' });
  for (let i = 0; i < c.nHead; i++) {
    const x = x0 + i * (hw + gap), hc = x + hw / 2;
    s += arrow(cx, 70, hc, 150);
    s += box({ x, y: 150, w: hw, h: 70, kind: 'op', title: `Head ${i + 1}`, sub: `T × ${c.headSize}`, go: ['head', i, `Head ${i + 1}`] });
    s += arrow(hc, 220, cx, 300);
  }
  s += box({ x: x0, y: 300, w: total, h: 50, title: 'concat', sub: `${c.nHead} × ${c.headSize} = ${c.nEmbd}` });
  s += arrow(cx, 350, cx, 390);
  s += box({ x: cx - 200, y: 390, w: 400, h: 50, kind: 'op', title: 'proj', sub: 'Linear 384 → 384' });
  s += arrow(cx, 440, cx, 470);
  s += box({ x: cx - 200, y: 470, w: 400, h: 44, kind: 'op', title: 'Dropout' });
  s += arrow(cx, 514, cx, 545);
  s += box({ x: cx - 200, y: 545, w: 400, h: 50, title: 'output', sub: '(B, T, 384)' });
  return { viewBox: '0 0 900 620', svg: s };
};

const ffwd = () => {
  const cx = 400;
  let s = box({ x: cx - 150, y: 20, w: 300, h: 50, title: 'x', sub: '(B, T, 384)' });
  s += arrow(cx, 70, cx, 100);
  s += trap({ x: cx - 240, y: 100, topW: 300, botW: 480, h: 90, title: 'Linear', sub: `384 → ${c.ffHidden}` });
  s += arrow(cx, 190, cx, 230);
  s += box({ x: cx - 240, y: 230, w: 480, h: 48, kind: 'op', title: 'ReLU' });
  s += arrow(cx, 278, cx, 318);
  s += trap({ x: cx - 240, y: 318, topW: 480, botW: 300, h: 90, title: 'Linear', sub: `${c.ffHidden} → 384` });
  s += arrow(cx, 408, cx, 448);
  s += box({ x: cx - 150, y: 448, w: 300, h: 44, kind: 'op', title: 'Dropout' });
  s += arrow(cx, 492, cx, 525);
  s += box({ x: cx - 150, y: 525, w: 300, h: 50, title: 'output', sub: '(B, T, 384)' });
  return { viewBox: '0 0 800 600', svg: s };
};

const shades = ['#9283e0', '#8577d0', '#6f62ab', '#5f5496', '#6a5da4'];

const triMatrix = (x, y) => {
  let s = `<rect class="matrix" x="${x}" y="${y}" width="340" height="340" rx="10"/>`;
  for (let i = 0; i < 8; i++)
    for (let j = 0; j <= i; j++)
      s += `<rect x="${x + 12 + j * 40}" y="${y + 13 + i * 40}" width="35" height="35" rx="4" fill="${shades[(i * 7 + j * 13 + (i === j ? 0 : 1)) % 5]}"/>`;
  return s;
};

const rot = (cx, cy, deg, cls, str) =>
  `<text class="${cls}" x="${cx}" y="${cy}" transform="rotate(${deg} ${cx} ${cy})">${str}</text>`;

const head = () => {
  let s = '<g class="big">';
  s += `<rect class="data" x="480" y="145" width="768" height="107" rx="12"/>`;
  s += text(864, 190, 'T embeddings', 'title') + text(864, 225, `each ${c.nEmbd} numbers`, 'sub');

  s += trap({ x: 482, y: 271, topW: 764, botW: 503, h: 190, title: 'key matrix', sub: `${c.nEmbd} → ${c.headSize}` });
  s += `<rect class="cyan-box" x="625" y="470" width="480" height="38"/>`;
  s += text(865, 490, `T times a vector with ${c.headSize} values (key vector)`, 'sub cyan-text');

  s += triMatrix(730, 517);
  s += text(900, 890, 'attention weights', 'title');
  s += text(900, 922, 'q•k = TxT → mask → softmax', 'sub');

  s += `<polygon class="op" points="1135,487 1325,380 1325,928 1135,828"/>`;
  s += text(1229, 650, 'query', 'title') + text(1229, 680, 'matrix', 'title') + text(1229, 710, `${c.nEmbd} → ${c.headSize}`, 'sub');
  s += text(1229, 765, 'T times', 'sub teal') + text(1229, 795, `${c.headSize} values`, 'sub teal');
  s += `<rect class="cyan-box" x="1083" y="519" width="40" height="305"/>`;
  s += rot(1103, 672, 90, 'sub cyan-text', 'query vector');
  s += `<rect class="data" x="1355" y="265" width="107" height="768" rx="12"/>`;
  s += rot(1408, 650, 90, 'title', 'T embeddings') + rot(1382, 650, 90, 'sub', `${c.nEmbd} numbers`);

  s += arrow(885, 960, 885, 1030);

  s += `<polygon class="op" points="566,1033 756,1094 756,1343 566,1403"/>`;
  s += text(661, 1182, 'value', 'title') + text(661, 1211, 'matrix', 'title') + text(661, 1244, `${c.nEmbd} → ${c.headSize}`, 'sub');
  s += text(661, 1289, 'T times', 'sub teal') + text(661, 1321, `${c.headSize} values`, 'sub teal');
  s += `<rect class="cyan-box" x="769" y="1090" width="40" height="250"/>`;
  s += rot(789, 1215, 90, 'sub cyan-text', 'value vector');
  s += `<rect class="data" x="433" y="850" width="107" height="768" rx="12"/>`;
  s += rot(487, 1234, -90, 'title', 'T embeddings') + rot(513, 1234, -90, 'sub', `${c.nEmbd} numbers`);

  s += triMatrix(831, 1046);
  s += text(858, 1413, 'weights @ v', 'sub');
  s += text(910, 1445, 'attention matrix multiplication with value vector', 'sub teal');

  s += `<rect class="op" x="651" y="1520" width="340" height="78" rx="12"/>`;
  s += text(821, 1545, 'output', 'title') + text(821, 1578, `T times ${c.headSize} values`, 'sub teal');
  return { viewBox: '400 120 1100 1520', svg: s + '</g>' };
};

export const views = { model, block, mha, ffwd, head };
