// Hearth & Ledger — SVG chart builders. Every chart is drawn from data.js
// as plain inline SVG: no library, no image, no network. All functions take
// plain values and return an SVG string.

export function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const money0 = (n) => '$' + Math.round(n).toLocaleString('en-US');

// Donut of spending by category (savings excluded). parts: [{label, value, color}]
export function donutChart(parts, size = 260) {
  const total = parts.reduce((s, p) => s + p.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 14;
  const inner = r * 0.62;
  let a0 = -Math.PI / 2;
  let paths = '';
  for (const p of parts) {
    const frac = p.value / total;
    const a1 = a0 + frac * Math.PI * 2;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1);
    const yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0);
    const yi0 = cy + inner * Math.sin(a0);
    paths += `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${xi1.toFixed(1)} ${yi1.toFixed(1)} A ${inner} ${inner} 0 ${large} 0 ${xi0.toFixed(1)} ${yi0.toFixed(1)} Z" fill="${p.color}"><title>${esc(p.label)}: $${p.value.toFixed(2)} (${(frac * 100).toFixed(1)}%)</title></path>`;
    a0 = a1;
  }
  return `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Spending by category donut chart" class="chart-svg">${paths}
    <text x="${cx}" y="${cy - 6}" text-anchor="middle" class="donut-centre-big">${money0(total)}</text>
    <text x="${cx}" y="${cy + 16}" text-anchor="middle" class="donut-centre-small">spent in Nov</text>
  </svg>`;
}

// Planned vs actual horizontal bars. rows: [{label, planned, actual, color}]
export function planBars(rows, width = 640) {
  const max = Math.max(...rows.flatMap((r) => [r.planned, r.actual]), 1);
  const barH = 14;
  const gap = 30;
  const labelW = 132;
  const valW = 66;
  const height = rows.length * (barH * 2 + gap) + 8;
  const scale = (v) => (v / max) * (width - labelW - valW - 8);
  let body = '';
  rows.forEach((r, i) => {
    const y = 8 + i * (barH * 2 + gap);
    const over = r.actual > r.planned;
    body += `<text x="0" y="${y + 11}" class="bar-label">${esc(r.label)}</text>`;
    body += `<rect x="${labelW}" y="${y}" width="${Math.max(scale(r.planned), 2).toFixed(1)}" height="${barH}" rx="3" fill="#c9d6c9" />`;
    body += `<text x="${labelW + scale(r.planned) + 6}" y="${y + 11}" class="bar-value dim">${money0(r.planned)}</text>`;
    body += `<rect x="${labelW}" y="${y + barH + 3}" width="${Math.max(scale(r.actual), 2).toFixed(1)}" height="${barH}" rx="3" fill="${over ? '#c25e5e' : r.color}" />`;
    body += `<text x="${labelW + scale(r.actual) + 6}" y="${y + barH + 14}" class="bar-value${over ? ' over' : ''}">${money0(r.actual)}${over ? ' over' : ''}</text>`;
  });
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Planned versus actual spending bars" class="chart-svg">${body}</svg>
  <p class="chart-legend"><span class="swatch" style="background:#c9d6c9"></span> planned &nbsp; <span class="swatch" style="background:#2f6f4f"></span> actual &nbsp; <span class="swatch" style="background:#c25e5e"></span> over budget</p>`;
}

// Line chart: income vs spending over months. points: [{label, income, spending}]
export function trendChart(points, width = 640, height = 260) {
  const padL = 52;
  const padR = 14;
  const padT = 18;
  const padB = 30;
  const max = Math.max(...points.flatMap((p) => [p.income, p.spending])) * 1.05;
  const min = 0;
  const x = (i) => padL + (i * (width - padL - padR)) / (points.length - 1);
  const y = (v) => padT + (1 - (v - min) / (max - min)) * (height - padT - padB);
  const grid = [0, 2000, 4000, 6000].map((v) => {
    if (v > max) return '';
    return `<line x1="${padL}" y1="${y(v)}" x2="${width - padR}" y2="${y(v)}" class="grid-line" /><text x="${padL - 6}" y="${y(v) + 4}" text-anchor="end" class="axis-label">${money0(v)}</text>`;
  }).join('');
  const line = (key, color) => {
    const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(p[key]).toFixed(1)}`).join(' ');
    const dots = points.map((p, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(p[key]).toFixed(1)}" r="4" fill="${color}"><title>${esc(p.label)} ${key}: $${p[key].toFixed(2)}</title></circle>`).join('');
    return `<path d="${d}" fill="none" stroke="${color}" stroke-width="2.5" />${dots}`;
  };
  const labels = points.map((p, i) => `<text x="${x(i)}" y="${height - 8}" text-anchor="middle" class="axis-label">${esc(p.label)}</text>`).join('');
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Income versus spending trend, six months" class="chart-svg">${grid}${line('income', '#2f6f4f')}${line('spending', '#c25e5e')}${labels}</svg>
  <p class="chart-legend"><span class="swatch" style="background:#2f6f4f"></span> take-home pay ($5,400) &nbsp; <span class="swatch" style="background:#c25e5e"></span> spending</p>`;
}

// Grouped vertical bars: one category across months.
// series: [{label, values:[...]}] with one colour per month.
export function monthCompareChart(categories, months, values, colors, width = 640, height = 280) {
  const padL = 52;
  const padR = 10;
  const padT = 16;
  const padB = 34;
  const max = Math.max(...values.flat(), 1) * 1.08;
  const slot = (width - padL - padR) / categories.length;
  const bw = Math.min(22, (slot - 14) / months.length);
  const y = (v) => padT + (1 - v / max) * (height - padT - padB);
  const grid = [0, 500, 1000, 1500].map((v) => {
    if (v > max) return '';
    return `<line x1="${padL}" y1="${y(v)}" x2="${width - padR}" y2="${y(v)}" class="grid-line" /><text x="${padL - 6}" y="${y(v) + 4}" text-anchor="end" class="axis-label">${money0(v)}</text>`;
  }).join('');
  let bars = '';
  categories.forEach((cat, ci) => {
    const groupW = months.length * bw;
    const x0 = padL + ci * slot + (slot - groupW) / 2;
    months.forEach((m, mi) => {
      const v = values[ci][mi];
      bars += `<rect x="${(x0 + mi * bw).toFixed(1)}" y="${y(v).toFixed(1)}" width="${bw - 2}" height="${(height - padB - y(v)).toFixed(1)}" rx="2" fill="${colors[mi]}"><title>${esc(cat)} — ${esc(m)}: $${v.toFixed(2)}</title></rect>`;
    });
    bars += `<text x="${(padL + ci * slot + slot / 2).toFixed(1)}" y="${height - 10}" text-anchor="middle" class="axis-label">${esc(cat)}</text>`;
  });
  const legend = months.map((m, i) => `<span class="swatch" style="background:${colors[i]}"></span> ${esc(m)}`).join(' &nbsp; ');
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Category spending compared across months" class="chart-svg">${grid}${bars}</svg>
  <p class="chart-legend">${legend}</p>`;
}

// Simple horizontal progress bar (0–100%).
export function progressBar(pct, color = '#2f6f4f') {
  const p = Math.max(0, Math.min(100, pct));
  return `<div class="progress" role="img" aria-label="${p.toFixed(0)} percent"><div class="progress-fill" style="width:${p.toFixed(1)}%;background:${color}"></div></div>`;
}
