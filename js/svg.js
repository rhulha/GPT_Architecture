const lines = (cx, cy, title, sub) => {
  const t = sub ? cy - 10 : cy;
  return `<text class="title" x="${cx}" y="${t}">${title}</text>` +
    (sub ? `<text class="sub" x="${cx}" y="${cy + 14}">${sub}</text>` : '');
};

const wrap = (go, inner) => {
  if (!go) return `<g>${inner}</g>`;
  const [view, arg, label] = go;
  return `<g class="link" data-view="${view}" data-arg="${arg ?? ''}" data-label="${label}">${inner}</g>`;
};

export const box = ({ x, y, w, h, title, sub, kind = 'data', go }) =>
  wrap(go, `<rect class="${kind}" x="${x}" y="${y}" width="${w}" height="${h}" rx="8"/>` +
    lines(x + w / 2, y + h / 2, title, sub));

export const trap = ({ x, y, topW, botW, h, title, sub, kind = 'op', go }) => {
  const cx = x + Math.max(topW, botW) / 2;
  const a = cx - topW / 2, b = cx + topW / 2, c = cx - botW / 2, d = cx + botW / 2;
  return wrap(go, `<polygon class="${kind}" points="${a},${y} ${b},${y} ${d},${y + h} ${c},${y + h}"/>` +
    lines(cx, y + h / 2, title, sub));
};

export const circle = (cx, cy, label) =>
  `<circle class="op" cx="${cx}" cy="${cy}" r="18"/><text class="title" x="${cx}" y="${cy}">${label}</text>`;

export const arrow = (x1, y1, x2, y2) => {
  const a = Math.atan2(y2 - y1, x2 - x1), s = 9;
  const p = (da) => `${x2 - s * Math.cos(a + da)},${y2 - s * Math.sin(a + da)}`;
  return `<path class="line" d="M${x1} ${y1} L${x2} ${y2}"/>` +
    `<polygon class="arrowhead" points="${x2},${y2} ${p(0.5)} ${p(-0.5)}"/>`;
};

export const path = (d) => `<path class="line" d="${d}"/>`;

export const text = (x, y, str, cls = 'note') => `<text class="${cls}" x="${x}" y="${y}">${str}</text>`;
