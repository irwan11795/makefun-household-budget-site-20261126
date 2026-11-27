// Hearth & Ledger — hash router and controls.
// Routes: #/ (dashboard), #/budget, #/expenses, #/goals, #/bills,
// #/reports, #/guide. Every control does what it says: the month picker
// re-renders the Budget page, the expense form really adds a row and
// updates the totals, the filters/sort/search re-list the transactions,
// the goal calculator works out a monthly figure live, and each bill
// toggle updates the paid/unpaid summary. No network is used anywhere.

import { BILLS, CATEGORIES, CURRENT_MONTH, money } from './data.js';
import {
  viewDashboard, viewBudget, viewExpenses, viewGoals, viewBills,
  viewReports, viewGuide,
} from './views.js';

const app = document.getElementById('app');
const navLinks = [...document.querySelectorAll('[data-route]')];

const state = {
  month: CURRENT_MONTH,
  expenses: { cat: '', query: '', sortBy: 'date', sortDir: 'desc', extra: [] },
  bills: BILLS.map((b) => ({ ...b })),
};

const ROUTES = {
  '': viewDashboard,
  budget: () => viewBudget(state.month),
  expenses: () => viewExpenses(state.expenses),
  goals: viewGoals,
  bills: () => viewBills(state),
  reports: viewReports,
  guide: viewGuide,
};

function currentRoute() {
  const hash = location.hash.replace(/^#\/?/, '');
  return ROUTES[hash] ? hash : '';
}

function render() {
  const route = currentRoute();
  app.innerHTML = ROUTES[route]();
  navLinks.forEach((a) => {
    const r = a.getAttribute('data-route');
    if (r === route) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  wireControls(route);
  window.scrollTo(0, 0);
}

function updateCalc() {
  const saved = Number(document.getElementById('calc-saved')?.value || 0);
  const target = Number(document.getElementById('calc-target')?.value || 0);
  const dateVal = document.getElementById('calc-date')?.value;
  const out = document.getElementById('calc-result');
  if (!out) return;
  if (!dateVal || target <= 0) {
    out.textContent = 'Enter a target amount and a target date.';
    return;
  }
  const monthsLeft = Math.max(
    1,
    Math.ceil((new Date(dateVal) - new Date('2026-11-26')) / (1000 * 60 * 60 * 24 * 30.44)),
  );
  const left = target - saved;
  if (left <= 0) {
    out.textContent = `Already there — ${money(saved)} saved is ${money(-left)} past the ${money(target)} target.`;
    return;
  }
  out.textContent = `Save ${money(left / monthsLeft)} a month for ${monthsLeft} month${monthsLeft === 1 ? '' : 's'} to reach ${money(target)} by ${dateVal} (${money(left)} still to go).`;
}

function wireControls(route) {
  if (route === 'budget') {
    const select = document.getElementById('month-select');
    if (select) {
      select.addEventListener('change', () => {
        state.month = select.value;
        render();
      });
    }
  }
  if (route === 'expenses') {
    const form = document.getElementById('add-expense');
    if (form) {
      form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const date = document.getElementById('exp-date').value;
        const desc = document.getElementById('exp-desc').value.trim();
        const cat = document.getElementById('exp-cat').value;
        const amount = Number(document.getElementById('exp-amount').value);
        const status = document.getElementById('add-status');
        if (!date || !desc || !Number.isFinite(amount) || amount <= 0) {
          if (status) status.textContent = 'Fill in a date, a description and an amount over $0.';
          return;
        }
        state.expenses.extra.push({ date, desc, cat, amount });
        state.expenses.extra.sort((a, b) => (a.date < b.date ? 1 : -1));
        render();
        const after = document.getElementById('add-status');
        const catName = CATEGORIES.find((c) => c.id === cat)?.name ?? cat;
        if (after) after.textContent = `Added ${money(amount)} — “${desc}” (${catName}, ${date}). The table and the totals above now include it.`;
      });
    }
    const catSel = document.getElementById('filter-cat');
    if (catSel) catSel.addEventListener('change', () => { state.expenses.cat = catSel.value; render(); });
    const q = document.getElementById('filter-q');
    if (q) q.addEventListener('input', () => { state.expenses.query = q.value; render(); });
    const sortBy = document.getElementById('sort-by');
    if (sortBy) sortBy.addEventListener('change', () => { state.expenses.sortBy = sortBy.value; render(); });
    const sortDir = document.getElementById('sort-dir');
    if (sortDir) {
      sortDir.addEventListener('click', () => {
        state.expenses.sortDir = state.expenses.sortDir === 'asc' ? 'desc' : 'asc';
        render();
      });
    }
    // Keep the search box focused after re-render so typing stays smooth.
    const qAfter = document.getElementById('filter-q');
    if (qAfter && state.expenses.query) {
      qAfter.focus();
      qAfter.setSelectionRange(qAfter.value.length, qAfter.value.length);
    }
  }
  if (route === 'goals') {
    updateCalc();
    for (const id of ['calc-saved', 'calc-target', 'calc-date']) {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', updateCalc);
    }
  }
  if (route === 'bills') {
    for (const btn of app.querySelectorAll('[data-bill]')) {
      btn.addEventListener('click', () => {
        const i = Number(btn.dataset.bill);
        state.bills[i].paid = !state.bills[i].paid;
        render();
      });
    }
  }
}

window.addEventListener('hashchange', render);
render();
