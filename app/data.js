// Hearth & Ledger — the Hartono household's budget data.
// Sample household figures for November 2026 (a fictional family: two
// adults, two children). Every "actual" figure for November is the sum of
// the transactions listed below, so the totals on the site always add up;
// September and October actuals are stored per category and sum to their
// month totals. All amounts are US dollars.

export const FAMILY = {
  name: 'The Hartono Family',
  members: 'Dewi & Andi Hartono, with Maya (10) and Budi (7)',
  home: '3-bedroom house, Greenfield',
  currency: 'USD',
  note: 'Sample household figures for November 2026',
};

export const INCOME_MONTHLY = 5400;
export const INCOME_LABEL = 'Take-home pay';
export const INCOME_SOURCES = [
  { source: "Dewi's salary (teacher)", amount: 2900 },
  { source: "Andi's salary (electrician)", amount: 2300 },
  { source: 'Child benefit', amount: 200 },
];

// group: needs / wants / savings — the 50/30/20 rule.
export const CATEGORIES = [
  { id: 'housing', name: 'Housing', color: '#2f6f4f', planned: 1500, group: 'needs' },
  { id: 'groceries', name: 'Groceries', color: '#4c9a6a', planned: 650, group: 'needs' },
  { id: 'utilities', name: 'Utilities', color: '#7fb069', planned: 220, group: 'needs' },
  { id: 'transport', name: 'Transport', color: '#e9a23b', planned: 280, group: 'needs' },
  { id: 'kids', name: 'Kids & School', color: '#d97b29', planned: 300, group: 'needs' },
  { id: 'health', name: 'Health', color: '#c25e5e', planned: 180, group: 'needs' },
  { id: 'dining', name: 'Dining Out', color: '#8a6fb8', planned: 200, group: 'wants' },
  { id: 'entertainment', name: 'Entertainment', color: '#5b8dbf', planned: 150, group: 'wants' },
  { id: 'clothing', name: 'Clothing', color: '#3e7a7a', planned: 120, group: 'wants' },
  { id: 'subscriptions', name: 'Subscriptions', color: '#9a7b4f', planned: 85, group: 'wants' },
  { id: 'personal', name: 'Personal', color: '#b85c8a', planned: 150, group: 'wants' },
  { id: 'home', name: 'Home & Garden', color: '#6a8caf', planned: 165, group: 'wants' },
  { id: 'gifts', name: 'Gifts & Giving', color: '#7a9e4b', planned: 200, group: 'wants' },
  { id: 'savings', name: 'Savings', color: '#2f6f4f', planned: 1200, group: 'savings' },
];

export const MONTHS = [
  { id: '2026-09', label: 'September 2026' },
  { id: '2026-10', label: 'October 2026' },
  { id: '2026-11', label: 'November 2026' },
];
export const CURRENT_MONTH = '2026-11';

// Per-category actuals for September and October (sums: Sep $4,110.30,
// Oct $4,089.75). November actuals are computed from TRANSACTIONS.
export const PAST_ACTUALS = {
  '2026-09': {
    housing: 1500, groceries: 698.40, utilities: 262.10, transport: 291.25,
    kids: 315.75, health: 176.50, dining: 245.80, entertainment: 132.00,
    clothing: 98.00, subscriptions: 57.46, personal: 118.60, home: 124.44,
    gifts: 90.00, savings: 1000,
  },
  '2026-10': {
    housing: 1500, groceries: 672.15, utilities: 248.90, transport: 268.40,
    kids: 289.00, health: 210.35, dining: 218.60, entertainment: 168.25,
    clothing: 145.50, subscriptions: 57.46, personal: 96.75, home: 88.30,
    gifts: 126.09, savings: 1000,
  },
};

// November 2026 transactions: 49 rows. Category sums (verified):
// housing 1500.00, groceries 714.50, utilities 371.95, transport 274.55,
// dining 229.35, entertainment 145.99, kids 282.50, health 199.20,
// clothing 157.99, subscriptions 57.46, personal 102.30, home 99.15,
// gifts 95.00, savings 1000.00. Spent (excl. savings) $4,229.94.
export const TRANSACTIONS = [
  { date: '2026-11-01', desc: 'Monthly rent — 3-bed house', cat: 'housing', amount: 1500.00 },
  { date: '2026-11-01', desc: 'Transfer — emergency fund', cat: 'savings', amount: 500.00 },
  { date: '2026-11-01', desc: 'Transfer — holiday fund', cat: 'savings', amount: 300.00 },
  { date: '2026-11-01', desc: 'Transfer — education fund', cat: 'savings', amount: 200.00 },
  { date: '2026-11-02', desc: 'Fuel — Shell', cat: 'transport', amount: 45.00 },
  { date: '2026-11-02', desc: 'Streaming — MovieBox', cat: 'subscriptions', amount: 15.49 },
  { date: '2026-11-02', desc: 'Music — TuneFlow', cat: 'subscriptions', amount: 10.99 },
  { date: '2026-11-03', desc: 'Weekly shop — GreenMart', cat: 'groceries', amount: 142.35 },
  { date: '2026-11-03', desc: 'Cloud storage 200 GB', cat: 'subscriptions', amount: 9.99 },
  { date: '2026-11-03', desc: 'School lunches — November', cat: 'kids', amount: 65.00 },
  { date: '2026-11-04', desc: 'Metro passes — family', cat: 'transport', amount: 120.00 },
  { date: '2026-11-04', desc: 'News — Daily Post', cat: 'subscriptions', amount: 12.00 },
  { date: '2026-11-05', desc: 'Gym — monthly', cat: 'health', amount: 45.00 },
  { date: '2026-11-06', desc: 'Pharmacy — vitamins', cat: 'health', amount: 34.20 },
  { date: '2026-11-06', desc: 'Dinner — Warung Sederhana', cat: 'dining', amount: 38.50 },
  { date: '2026-11-07', desc: 'Weekly shop — GreenMart', cat: 'groceries', amount: 158.20 },
  { date: '2026-11-07', desc: 'Magazine — Home & Living', cat: 'subscriptions', amount: 8.99 },
  { date: '2026-11-07', desc: 'Haircut — Dad', cat: 'personal', amount: 35.00 },
  { date: '2026-11-08', desc: 'Cinema — family movie', cat: 'entertainment', amount: 32.00 },
  { date: '2026-11-08', desc: 'Water bill — Aqua Municipal', cat: 'utilities', amount: 48.25 },
  { date: '2026-11-09', desc: 'Fuel — Shell', cat: 'transport', amount: 52.30 },
  { date: '2026-11-09', desc: 'Hardware — shelves', cat: 'home', amount: 56.40 },
  { date: '2026-11-10', desc: 'Textbooks — Maya', cat: 'kids', amount: 42.50 },
  { date: '2026-11-10', desc: 'Internet — Fiber 200 Mbps', cat: 'utilities', amount: 79.00 },
  { date: '2026-11-11', desc: "Kids' shoes — Budi", cat: 'clothing', amount: 68.00 },
  { date: '2026-11-12', desc: 'Electricity bill — City Power', cat: 'utilities', amount: 96.40 },
  { date: '2026-11-13', desc: 'Gas bill — HomeGas', cat: 'utilities', amount: 62.30 },
  { date: '2026-11-12', desc: 'After-school club — Budi', cat: 'kids', amount: 120.00 },
  { date: '2026-11-13', desc: 'Pizza night — family', cat: 'dining', amount: 62.00 },
  { date: '2026-11-14', desc: 'Weekly shop — GreenMart', cat: 'groceries', amount: 135.60 },
  { date: '2026-11-14', desc: 'Concert tickets — local band', cat: 'entertainment', amount: 85.00 },
  { date: '2026-11-14', desc: 'Haircut — kids', cat: 'personal', amount: 25.00 },
  { date: '2026-11-15', desc: 'Lunch — office canteen', cat: 'dining', amount: 24.75 },
  { date: '2026-11-15', desc: 'Plants — garden centre', cat: 'home', amount: 24.00 },
  { date: '2026-11-16', desc: 'Fuel — Shell', cat: 'transport', amount: 38.75 },
  { date: '2026-11-16', desc: 'Birthday gift — Grandma', cat: 'gifts', amount: 45.00 },
  { date: '2026-11-17', desc: 'Dentist — check-up', cat: 'health', amount: 120.00 },
  { date: '2026-11-18', desc: 'Toiletries — drugstore', cat: 'personal', amount: 42.30 },
  { date: '2026-11-18', desc: 'Phone — two lines', cat: 'utilities', amount: 86.00 },
  { date: '2026-11-19', desc: 'School trip — science museum', cat: 'kids', amount: 55.00 },
  { date: '2026-11-20', desc: 'Dinner — Noodle House', cat: 'dining', amount: 45.90 },
  { date: '2026-11-21', desc: 'Weekly shop — GreenMart', cat: 'groceries', amount: 148.90 },
  { date: '2026-11-21', desc: 'Board game — Catan', cat: 'entertainment', amount: 28.99 },
  { date: '2026-11-21', desc: 'Cleaning supplies', cat: 'home', amount: 18.75 },
  { date: '2026-11-22', desc: 'Parking — downtown', cat: 'transport', amount: 18.50 },
  { date: '2026-11-24', desc: 'Winter jacket — Maya', cat: 'clothing', amount: 89.99 },
  { date: '2026-11-25', desc: 'Charity — food bank', cat: 'gifts', amount: 50.00 },
  { date: '2026-11-26', desc: 'Weekly shop — GreenMart', cat: 'groceries', amount: 129.45 },
  { date: '2026-11-26', desc: 'Takeaway — sushi set', cat: 'dining', amount: 58.20 },
];

// Six-month trend (Jun–Nov 2026). Spending = sum of that month's
// transactions; November $4,229.94 matches the table above.
export const TREND = [
  { month: 'Jun 2026', income: 5400, spending: 4021.10 },
  { month: 'Jul 2026', income: 5400, spending: 4288.45 },
  { month: 'Aug 2026', income: 5400, spending: 3975.60 },
  { month: 'Sep 2026', income: 5400, spending: 4110.30 },
  { month: 'Oct 2026', income: 5400, spending: 4089.75 },
  { month: 'Nov 2026', income: 5400, spending: 4229.94 },
];

export const GOALS = [
  { id: 'emergency', name: 'Emergency fund', target: 10000, saved: 6400, targetDate: '2027-12-31', note: '6 months of essentials — the safety net first.' },
  { id: 'holiday', name: 'Family holiday', target: 3000, saved: 1850, targetDate: '2027-06-30', note: 'A week by the sea next summer.' },
  { id: 'fridge', name: 'New fridge', target: 1200, saved: 780, targetDate: '2027-03-31', note: 'The old one hums too loud and eats power.' },
  { id: 'education', name: "Kids' education", target: 5000, saved: 2300, targetDate: '2028-12-31', note: 'A head start for Maya and Budi.' },
];

// Recurring bills for November. Paid bills appear as transactions above
// (rent $1,500; gym $45; electricity $96.40; water $48.25; internet $79;
// phone $86). School fees $240 = school lunches $65 + club $120 + trip $55.
// The two unpaid bills ($145 + $240 = $385) are not in expenses yet.
export const BILLS = [
  { name: 'Rent', amount: 1500.00, due: '2026-11-01', paid: true, note: '3-bed house' },
  { name: 'Gym', amount: 45.00, due: '2026-11-05', paid: true, note: 'Family membership' },
  { name: 'Internet', amount: 79.00, due: '2026-11-10', paid: true, note: 'Fiber 200 Mbps' },
  { name: 'Electricity', amount: 96.40, due: '2026-11-12', paid: true, note: 'City Power' },
  { name: 'Water', amount: 48.25, due: '2026-11-15', paid: true, note: 'Aqua Municipal' },
  { name: 'Phone — two lines', amount: 86.00, due: '2026-11-18', paid: true, note: 'Mobile plan' },
  { name: 'Home insurance', amount: 145.00, due: '2026-11-20', paid: false, note: 'Annual, paid monthly' },
  { name: 'School fees', amount: 240.00, due: '2026-11-25', paid: false, note: 'Lunches + club + trip' },
];

export const TIPS = [
  { title: 'Pay yourself first', text: 'Move the savings transfer on payday, before any spending — $1,000 left the account on 1 November, before the first shop.' },
  { title: 'One weekly shop', text: 'Four GreenMart shops a month, with a list. A fifth unplanned trip is where most grocery overspend hides.' },
  { title: 'Audit subscriptions', text: 'Five subscriptions cost $57.46 a month. Cancel one you have not opened in 30 days and bank the difference.' },
  { title: 'The 24-hour rule', text: 'Any non-essential over $50 waits a day. The jacket passed; most impulse buys do not.' },
  { title: 'Cook twice, eat four times', text: 'Batch cooking on Sunday covers two weekday dinners and cuts the dining-out line.' },
  { title: 'Track the small leaks', text: 'Parking, magazines and cleaning supplies are small alone — $18.50 + $8.99 + $18.75 still adds up to real money.' },
];

// ---- helpers (pure arithmetic over the data above) ----

export function money(n) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function categoryById(id) {
  return CATEGORIES.find((c) => c.id === id);
}

export function actualsFor(monthId) {
  if (monthId === CURRENT_MONTH) {
    const out = {};
    for (const c of CATEGORIES) out[c.id] = 0;
    for (const t of TRANSACTIONS) out[t.cat] = (out[t.cat] ?? 0) + t.amount;
    return out;
  }
  return { ...PAST_ACTUALS[monthId] };
}

export function monthTotals(monthId) {
  const a = actualsFor(monthId);
  let spent = 0;
  let saved = 0;
  for (const c of CATEGORIES) {
    if (c.group === 'savings') saved += a[c.id];
    else spent += a[c.id];
  }
  const planned = CATEGORIES.reduce((s, c) => s + c.planned, 0);
  return {
    income: INCOME_MONTHLY, spent, saved,
    remaining: INCOME_MONTHLY - spent - saved, planned,
  };
}

export function groupTotals(monthId) {
  const a = actualsFor(monthId);
  const g = { needs: 0, wants: 0, savings: 0 };
  for (const c of CATEGORIES) g[c.group] += a[c.id];
  return g;
}

export function overUnder(monthId) {
  const a = actualsFor(monthId);
  return CATEGORIES.map((c) => ({
    ...c, actual: a[c.id], diff: a[c.id] - c.planned,
  })).sort((x, y) => y.diff - x.diff);
}
