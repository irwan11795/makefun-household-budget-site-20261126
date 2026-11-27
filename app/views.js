// Hearth & Ledger — one renderer per page. Each returns an HTML string;
// main.js wires the controls after render. All figures come from data.js,
// so the numbers on every page are the same numbers.

import {
  FAMILY, INCOME_MONTHLY, INCOME_LABEL, INCOME_SOURCES, CATEGORIES, MONTHS,
  CURRENT_MONTH, TRANSACTIONS, TREND, GOALS, BILLS, TIPS,
  money, categoryById, actualsFor, monthTotals, groupTotals, overUnder,
} from './data.js';
import { donutChart, planBars, trendChart, monthCompareChart, progressBar, esc } from './charts.js';

const monthLabel = (id) => (MONTHS.find((m) => m.id === id) ?? MONTHS[2]).label;

function kpiCards(t) {
  return `<section class="kpi-grid" aria-label="November budget at a glance">
    <div class="kpi"><p class="kpi-label">${INCOME_LABEL}</p><p class="kpi-value">${money(t.income)}</p><p class="kpi-sub">Nov 2026 · Dewi $2,900 + Andi $2,300 + benefit $200</p></div>
    <div class="kpi"><p class="kpi-label">Spent</p><p class="kpi-value">${money(t.spent)}</p><p class="kpi-sub">49 transactions · 13 categories</p></div>
    <div class="kpi"><p class="kpi-label">Saved</p><p class="kpi-value good">${money(t.saved)}</p><p class="kpi-sub">18.5% of pay — target 20%</p></div>
    <div class="kpi"><p class="kpi-label">Left to spend</p><p class="kpi-value good">${money(t.remaining)}</p><p class="kpi-sub">of $5,400 after spending &amp; saving</p></div>
  </section>`;
}

function monthPicker(selected) {
  return `<label class="picker">Month
    <select id="month-select">${MONTHS.map((m) => `<option value="${m.id}"${m.id === selected ? ' selected' : ''}>${m.label}</option>`).join('')}</select>
  </label>`;
}

export function viewDashboard() {
  const t = monthTotals(CURRENT_MONTH);
  const a = actualsFor(CURRENT_MONTH);
  const spendParts = CATEGORIES.filter((c) => c.group !== 'savings')
    .map((c) => ({ label: c.name, value: a[c.id], color: c.color }))
    .filter((p) => p.value > 0)
    .sort((x, y) => y.value - x.value);
  const bars = overUnder(CURRENT_MONTH).filter((c) => c.group !== 'savings').slice(0, 7);
  const upcoming = BILLS.filter((b) => !b.paid).sort((x, y) => x.due.localeCompare(y.due));
  const paidCount = BILLS.filter((b) => b.paid).length;
  const goal = GOALS[0];
  const goalPct = (goal.saved / goal.target) * 100;
  const legend = spendParts.map((p) => `<li><span class="swatch" style="background:${p.color}"></span>${esc(p.label)} <strong>${money(p.value)}</strong> <span class="dim">(${(p.value / t.spent * 100).toFixed(1)}%)</span></li>`).join('');
  return `
  <h1>November budget — ${esc(FAMILY.name)}</h1>
  <p class="lede">${esc(FAMILY.members)} · ${esc(FAMILY.home)}. ${esc(FAMILY.note)}: take-home pay ${money(INCOME_MONTHLY)} a month, tracked with the 50/30/20 rule.</p>
  ${kpiCards(t)}
  <div class="two-col">
    <section class="card">
      <h2>Where November's money went</h2>
      ${donutChart(spendParts)}
      <ul class="legend-list">${legend}</ul>
    </section>
    <section class="card">
      <h2>Budget vs actual — biggest categories</h2>
      ${planBars(bars.map((c) => ({ label: c.name, planned: c.planned, actual: c.actual, color: c.color })))}
      <p class="card-link"><a href="#/budget">See the full budget →</a></p>
    </section>
  </div>
  <div class="two-col">
    <section class="card">
      <h2>Bills due soon</h2>
      <p>${paidCount} of ${BILLS.length} November bills paid. <strong>${upcoming.length} still to pay — ${money(upcoming.reduce((s, b) => s + b.amount, 0))}:</strong></p>
      <ul class="bill-list">${upcoming.map((b) => `<li><span><strong>${esc(b.name)}</strong> — ${esc(b.note)}</span><span class="num">${money(b.amount)} · due ${b.due.slice(5)}</span></li>`).join('')}</ul>
      <p class="card-link"><a href="#/bills">All bills &amp; pay toggles →</a></p>
    </section>
    <section class="card">
      <h2>Top savings goal</h2>
      <p><strong>${esc(goal.name)}</strong> — ${money(goal.saved)} of ${money(goal.target)} (${goalPct.toFixed(0)}%)</p>
      ${progressBar(goalPct)}
      <p class="dim">${esc(goal.note)} At $500 a month it is done in ${Math.ceil((goal.target - goal.saved) / 500)} months.</p>
      <p class="card-link"><a href="#/goals">All 4 goals &amp; calculator →</a></p>
    </section>
  </div>
  <section class="card">
    <h2>This month in one line</h2>
    <p>Needs took ${money(groupTotals(CURRENT_MONTH).needs)} (${(groupTotals(CURRENT_MONTH).needs / INCOME_MONTHLY * 100).toFixed(1)}% of pay, target 50%), wants ${money(groupTotals(CURRENT_MONTH).wants)} (${(groupTotals(CURRENT_MONTH).wants / INCOME_MONTHLY * 100).toFixed(1)}%, target 30%), savings ${money(groupTotals(CURRENT_MONTH).savings)} (${(groupTotals(CURRENT_MONTH).savings / INCOME_MONTHLY * 100).toFixed(1)}%, target 20%). Utilities ran ${money(overUnder(CURRENT_MONTH)[0].diff)} over plan — the biggest overspend — while gifts came in ${money(-overUnder(CURRENT_MONTH).filter((c) => c.group !== 'savings').at(-1).diff)} under.</p>
  </section>`;
}

export function viewBudget(monthId) {
  const t = monthTotals(monthId);
  const g = groupTotals(monthId);
  const rows = overUnder(monthId);
  const target = { needs: INCOME_MONTHLY * 0.5, wants: INCOME_MONTHLY * 0.3, savings: INCOME_MONTHLY * 0.2 };
  const ruleRow = (label, actual, targetV) => {
    const pct = (actual / INCOME_MONTHLY * 100).toFixed(1);
    const diff = actual - targetV;
    return `<tr><td>${label}</td><td class="num">${money(targetV)}</td><td class="num">${money(actual)}</td><td class="num">${pct}%</td><td class="num ${diff > 0 ? 'over' : 'good'}">${diff > 0 ? '+' : ''}${money(diff)}</td></tr>`;
  };
  return `
  <h1>Budget — ${monthLabel(monthId)}</h1>
  <p class="lede">The 50/30/20 plan: 50% needs, 30% wants, 20% savings on ${money(INCOME_MONTHLY)} take-home pay. ${monthId === CURRENT_MONTH ? 'November actuals are the sums of the 49 transactions on the Expenses page.' : 'Actuals are the month’s recorded spending per category.'}</p>
  <div class="toolbar">${monthPicker(monthId)}<span class="dim">Planned total ${money(t.planned)} = take-home pay ${money(t.income)}</span></div>
  <section class="card">
    <h2>The 50/30/20 split — ${monthLabel(monthId)}</h2>
    <table class="facts"><thead><tr><th>Bucket</th><th>Target (50/30/20)</th><th>Actual</th><th>Share of pay</th><th>Over / under</th></tr></thead>
    <tbody>
      ${ruleRow('Needs', g.needs, target.needs)}
      ${ruleRow('Wants', g.wants, target.wants)}
      ${ruleRow('Savings', g.savings, target.savings)}
      <tr class="total-row"><td>Total</td><td class="num">${money(INCOME_MONTHLY)}</td><td class="num">${money(g.needs + g.wants + g.savings)}</td><td class="num">${((g.needs + g.wants + g.savings) / INCOME_MONTHLY * 100).toFixed(1)}%</td><td class="num">${money(INCOME_MONTHLY - (g.needs + g.wants + g.savings))} left</td></tr>
    </tbody></table>
    <p>${g.needs > target.needs ? `Needs ran ${money(g.needs - target.needs)} over the 50% target — housing alone is ${money(1500)}. The fix is not a smaller shop; it is the savings rate: wants came in ${money(target.wants - g.wants)} under target, which covered most of it.` : 'Needs stayed inside the 50% target.'}</p>
  </section>
  <section class="card">
    <h2>Planned vs actual by category</h2>
    ${planBars(rows.filter((c) => c.group !== 'savings').map((c) => ({ label: c.name, planned: c.planned, actual: c.actual, color: c.color })))}
    <table class="facts"><thead><tr><th>Category</th><th>Planned</th><th>Actual</th><th>Over / under</th><th>Status</th></tr></thead>
    <tbody>${rows.map((c) => `<tr><td>${esc(c.name)}</td><td class="num">${money(c.planned)}</td><td class="num">${money(c.actual)}</td><td class="num ${c.diff > 0 ? 'over' : 'good'}">${c.diff > 0 ? '+' : ''}${money(c.diff)}</td><td>${c.diff > 0 ? 'Over budget' : c.diff < 0 ? 'Under budget' : 'On plan'}</td></tr>`).join('')}</tbody></table>
  </section>`;
}

export function viewExpenses(state) {
  const cats = [{ id: '', name: 'All categories' }, ...CATEGORIES];
  const q = (state.query || '').toLowerCase();
  let rows = [...state.extra, ...TRANSACTIONS];
  if (state.cat) rows = rows.filter((t) => t.cat === state.cat);
  if (q) rows = rows.filter((t) => t.desc.toLowerCase().includes(q) || t.date.includes(q));
  const dir = state.sortDir === 'asc' ? 1 : -1;
  rows.sort((a, b) => {
    if (state.sortBy === 'amount') return (a.amount - b.amount) * dir;
    return (a.date < b.date ? -1 : a.date > b.date ? 1 : 0) * dir;
  });
  const total = rows.reduce((s, t) => s + t.amount, 0);
  const allTotal = [...state.extra, ...TRANSACTIONS].reduce((s, t) => s + t.amount, 0);
  return `
  <h1>Expenses — November 2026</h1>
  <p class="lede">${TRANSACTIONS.length + state.extra.length} transactions, ${money(allTotal)} in total (${money(monthTotals(CURRENT_MONTH).spent)} spending + ${money(monthTotals(CURRENT_MONTH).saved)} savings). Showing ${rows.length} rows totalling ${money(total)}. Use the controls below to filter by category, search, or sort by date or amount.</p>
  <section class="card">
    <h2>Add an expense</h2>
    <form id="add-expense" class="add-form">
      <label>Date <input type="date" id="exp-date" value="2026-11-26" min="2026-11-01" max="2026-11-30" required></label>
      <label>Description <input type="text" id="exp-desc" placeholder="e.g. Weekly shop — GreenMart" required maxlength="80"></label>
      <label>Category <select id="exp-cat">${CATEGORIES.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join('')}</select></label>
      <label>Amount ($) <input type="number" id="exp-amount" min="0.01" step="0.01" placeholder="0.00" required></label>
      <button type="submit">Add expense</button>
    </form>
    <p id="add-status" class="dim" aria-live="polite"></p>
  </section>
  <section class="card">
    <h2>All transactions</h2>
    <div class="toolbar">
      <label>Category <select id="filter-cat">${cats.map((c) => `<option value="${c.id}"${c.id === state.cat ? ' selected' : ''}>${esc(c.name)}</option>`).join('')}</select></label>
      <label>Search <input type="search" id="filter-q" placeholder="description or date" value="${esc(state.query || '')}"></label>
      <label>Sort <select id="sort-by"><option value="date"${state.sortBy === 'date' ? ' selected' : ''}>Date</option><option value="amount"${state.sortBy === 'amount' ? ' selected' : ''}>Amount</option></select></label>
      <button id="sort-dir" type="button">${state.sortDir === 'asc' ? '↑ Ascending' : '↓ Descending'}</button>
    </div>
    <table class="facts wide"><thead><tr><th>Date</th><th>Description</th><th>Category</th><th class="num">Amount</th></tr></thead>
    <tbody>${rows.map((t) => `<tr><td>${t.date}</td><td>${esc(t.desc)}</td><td>${esc(categoryById(t.cat)?.name ?? t.cat)}</td><td class="num">${money(t.amount)}</td></tr>`).join('') || '<tr><td colspan="4">No transactions match — clear the search or pick another category.</td></tr>'}</tbody></table>
  </section>`;
}

export function viewGoals() {
  const cards = GOALS.map((g) => {
    const pct = (g.saved / g.target) * 100;
    const left = g.target - g.saved;
    const monthsLeft = Math.max(1, Math.ceil((new Date(g.targetDate) - new Date('2026-11-26')) / (1000 * 60 * 60 * 24 * 30.44)));
    const perMonth = left / monthsLeft;
    return `<div class="goal-card">
      <h3>${esc(g.name)}</h3>
      <p class="goal-nums"><strong>${money(g.saved)}</strong> of ${money(g.target)} · ${pct.toFixed(0)}% · by ${g.targetDate}</p>
      ${progressBar(pct)}
      <p>${money(left)} to go — ${money(perMonth)} a month for ${monthsLeft} months hits the date.</p>
      <p class="dim">${esc(g.note)}</p>
    </div>`;
  }).join('');
  return `
  <h1>Savings goals</h1>
  <p class="lede">Four goals, ${money(GOALS.reduce((s, g) => s + g.saved, 0))} saved of ${money(GOALS.reduce((s, g) => s + g.target, 0))} target. Every goal's monthly figure is worked out from its target date — change the numbers below and watch it move.</p>
  <div class="goal-grid">${cards}</div>
  <section class="card">
    <h2>Goal calculator</h2>
    <p>How much a month do you need to save to hit a target by a date?</p>
    <form id="goal-calc" class="calc-form">
      <label>Already saved ($) <input type="number" id="calc-saved" min="0" step="1" value="6400"></label>
      <label>Target ($) <input type="number" id="calc-target" min="1" step="1" value="10000"></label>
      <label>Target date <input type="date" id="calc-date" value="2027-12-31" min="2026-12-01"></label>
    </form>
    <p id="calc-result" class="calc-result" aria-live="polite"></p>
    <p class="dim">Example: emergency fund — $6,400 saved of $10,000 by 31 Dec 2027 is $3,600 over 13 months = $276.92 a month. The family already moves $500 a month, so it lands early, in about 7 months.</p>
  </section>`;
}

export function viewBills(state) {
  const bills = state.bills;
  const paid = bills.filter((b) => b.paid);
  const unpaid = bills.filter((b) => !b.paid);
  const paidTotal = paid.reduce((s, b) => s + b.amount, 0);
  const unpaidTotal = unpaid.reduce((s, b) => s + b.amount, 0);
  const rows = [...bills].sort((a, b) => a.due.localeCompare(b.due)).map((b, i) => {
    const idx = bills.indexOf(b);
    return `<tr><td>${esc(b.name)}</td><td class="dim">${esc(b.note)}</td><td>${b.due}</td><td class="num">${money(b.amount)}</td><td>${b.paid ? '<span class="good">Paid ✓</span>' : '<span class="over">Unpaid</span>'}</td><td><button type="button" data-bill="${idx}">${b.paid ? 'Mark unpaid' : 'Mark paid'}</button></td></tr>`;
  }).join('');
  return `
  <h1>Bills — November 2026</h1>
  <p class="lede">Every recurring bill, its due date and whether it is paid. Flip a toggle and the summary below updates — paid bills are the ones that already appear as transactions on the Expenses page.</p>
  <section class="card">
    <h2>Summary</h2>
    <p><strong>${paid.length} paid · ${money(paidTotal)}</strong> &nbsp;·&nbsp; <strong>${unpaid.length} unpaid · ${money(unpaidTotal)}</strong> &nbsp;·&nbsp; total bills ${money(paidTotal + unpaidTotal)}</p>
    <p class="dim">Unpaid right now: home insurance ${money(145)} (due 20 Nov) and school fees ${money(240)} (due 25 Nov). School fees split as lunches $65 + club $120 + trip $55 on the Expenses page.</p>
  </section>
  <section class="card">
    <h2>All bills</h2>
    <table class="facts wide"><thead><tr><th>Bill</th><th>Note</th><th>Due</th><th class="num">Amount</th><th>Status</th><th></th></tr></thead>
    <tbody>${rows}</tbody></table>
  </section>`;
}

export function viewReports() {
  const t = monthTotals(CURRENT_MONTH);
  const avg = TREND.reduce((s, p) => s + p.spending, 0) / TREND.length;
  const ou = overUnder(CURRENT_MONTH).filter((c) => c.group !== 'savings');
  const mostOver = ou[0];
  const mostUnder = ou.at(-1);
  const cats = ['Housing', 'Groceries', 'Utilities', 'Transport', 'Dining'];
  const ids = ['housing', 'groceries', 'utilities', 'transport', 'dining'];
  const values = ids.map((id) => ['2026-09', '2026-10', '2026-11'].map((m) => actualsFor(m)[id]));
  const savingsRate = (t.saved / INCOME_MONTHLY * 100).toFixed(1);
  return `
  <h1>Reports — six months to November 2026</h1>
  <p class="lede">Income has been a flat ${money(INCOME_MONTHLY)} a month; spending moves between ${money(Math.min(...TREND.map((p) => p.spending)))} and ${money(Math.max(...TREND.map((p) => p.spending)))}. Average spending ${money(avg)} a month, so the household banks about ${money(INCOME_MONTHLY - avg)} a month on average.</p>
  <section class="card">
    <h2>Income vs spending — Jun to Nov 2026</h2>
    ${trendChart(TREND)}
    <p>November spending ${money(TREND[5].spending)} is the second-highest of the six months, ${money(TREND[5].spending - avg)} above the average, driven by utilities and the winter jacket. The gap to income — ${money(INCOME_MONTHLY - TREND[5].spending)} — is what was left after spending, before the ${money(1000)} savings transfer.</p>
  </section>
  <section class="card">
    <h2>Biggest categories — Sep vs Oct vs Nov</h2>
    ${monthCompareChart(cats, ['Sep', 'Oct', 'Nov'], values, ['#b9c9b9', '#7fa37f', '#2f6f4f'])}
    <p>Housing is flat at ${money(1500)} every month. Groceries drifted up from ${money(698.40)} to ${money(714.50)}; utilities jumped from ${money(262.10)} to ${money(371.95)} as heating and the phone plan landed in the same month.</p>
  </section>
  <section class="card">
    <h2>What the numbers say</h2>
    <ul class="insight-list">
      <li><strong>Most over budget:</strong> ${esc(mostOver.name)} — ${money(mostOver.actual)} against a ${money(mostOver.planned)} plan, ${money(mostOver.diff)} over. The gas bill and the phone plan both fell in November.</li>
      <li><strong>Most under budget:</strong> ${esc(mostUnder.name)} — ${money(mostUnder.actual)} against a ${money(mostUnder.planned)} plan, ${money(-mostUnder.diff)} under. No big gift this month; the birthday was $45.</li>
      <li><strong>Savings rate:</strong> ${savingsRate}% of take-home pay (${money(t.saved)} of ${money(INCOME_MONTHLY)}), short of the 20% target by ${money(INCOME_MONTHLY * 0.2 - t.saved)}. Raising the 1st-of-month transfer by $80 closes it.</li>
      <li><strong>Needs are heavy:</strong> ${(groupTotals(CURRENT_MONTH).needs / INCOME_MONTHLY * 100).toFixed(1)}% of pay goes to needs (target 50%). Wants are light at ${(groupTotals(CURRENT_MONTH).wants / INCOME_MONTHLY * 100).toFixed(1)}% — the family is not overspending on fun, it is paying for a house and two children.</li>
      <li><strong>Left over:</strong> ${money(t.remaining)} unallocated at month end. The guide's rule: sweep anything left on the 28th into the emergency fund.</li>
    </ul>
  </section>`;
}

export function viewGuide() {
  return `
  <h1>Guide — how this budget works</h1>
  <p class="lede">A short guide to the 50/30/20 rule, how the Hartonos' numbers are worked out, and the habits that keep the budget on track.</p>
  <section class="card">
    <h2>The 50/30/20 rule</h2>
    <p>Split take-home pay three ways: <strong>50% needs</strong> (housing, groceries, utilities, transport, school, health), <strong>30% wants</strong> (dining out, entertainment, clothes, subscriptions, gifts), <strong>20% savings</strong> (emergency fund, goals, extra debt payments). On ${money(INCOME_MONTHLY)} that is ${money(2700)} / ${money(1620)} / ${money(1080)}.</p>
    <p>It is a target, not a law. The Hartonos run needs at ${(groupTotals(CURRENT_MONTH).needs / INCOME_MONTHLY * 100).toFixed(1)}% because rent is ${money(1500)} — so they hold wants down to ${(groupTotals(CURRENT_MONTH).wants / INCOME_MONTHLY * 100).toFixed(1)}% and protect savings first. If your rent is over half your pay, the rule bends: fix the biggest line first, then rebalance the rest.</p>
  </section>
  <section class="card">
    <h2>How the figures are worked out</h2>
    <ul class="insight-list">
      <li><strong>Take-home pay</strong> — ${money(INCOME_MONTHLY)}: ${INCOME_SOURCES.map((s) => `${esc(s.source)} ${money(s.amount)}`).join(' · ')}.</li>
      <li><strong>Planned</strong> — the budget set on the 1st of the month, per category. The fourteen plans add to ${money(CATEGORIES.reduce((s, c) => s + c.planned, 0))}, exactly the take-home pay.</li>
      <li><strong>Actual</strong> — the sum of the month's transactions in that category. November's actuals come from the 49 dated transactions on the Expenses page; nothing is typed in by hand.</li>
      <li><strong>Spent, saved, left</strong> — spent ${money(monthTotals(CURRENT_MONTH).spent)} + saved ${money(monthTotals(CURRENT_MONTH).saved)} + left ${money(monthTotals(CURRENT_MONTH).remaining)} = ${money(INCOME_MONTHLY)}.</li>
      <li><strong>Goals</strong> — monthly need = (target − saved) ÷ months left to the target date.</li>
    </ul>
  </section>
  <section class="card">
    <h2>Six habits that save money</h2>
    <ol class="tip-list">${TIPS.map((tip) => `<li><strong>${esc(tip.title)}.</strong> ${esc(tip.text)}</li>`).join('')}</ol>
  </section>
  <section class="card">
    <h2>About this site</h2>
    <p><strong>Hearth &amp; Ledger</strong> is a sample household budget site. ${esc(FAMILY.note)} — the Hartono family is fictional and the figures are illustrative, shown so a household can see what a working budget looks like. No data leaves your browser: every figure, filter and calculation runs on this page.</p>
  </section>`;
}
