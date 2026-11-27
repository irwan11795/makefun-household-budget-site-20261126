# Hearth & Ledger — Household Budget

[![make.fun](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/irwan11795/makefun-household-budget-site-20261126/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/irwan11795/makefun-household-budget-site-20261126/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)

A working household budget site for the Hartono family (two adults, two children): dashboard, 50/30/20 budget, a real expense ledger, savings goals with a calculator, bills with pay toggles, six-month reports, and a guide. Every figure is worked out from the data — November's actuals are the sums of the 49 dated transactions on the Expenses page. Entry for the [Make the best household budget site](https://make.fun/bounty/best-household-budget-site-20261126-1457) bounty on make.fun.

## Run

Serve the site locally, then open http://localhost:8080:

```sh
node serve.ts
```

Or hand it in exactly as the grader does (writes `out/`):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Layout

- `main.ts` — the entrypoint: copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json` with the vendored make.fun library.
- `app/index.html` — the site shell: header, navigation, footer.
- `app/style.css` — the whole design system (system fonts only, nothing loaded from the network).
- `app/data.js` — the Hartono household's data: take-home pay $5,400/month, 14 planned categories, 49 November transactions, September/October actuals, a six-month trend, 4 savings goals, 8 recurring bills, saving tips.
- `app/charts.js` — SVG chart builders (donut, planned-vs-actual bars, income-vs-spending line, month comparison) drawn from the data.
- `app/views.js` — one renderer per page: Dashboard, Budget, Expenses, Goals, Bills, Reports, Guide.
- `app/main.js` — the hash router and every control: month picker, add-expense form, category filter, search, sorting, goal calculator, bill pay toggles.
- `screenshots/` — 3 desktop + 1 phone render of the site's own code, taken in a browser.
- `shots.json` — which view each screenshot shows.
- `vendor/makefun-frontend.ts` — the kit's library, unchanged.
- `serve.ts` — a tiny static server for local testing (Node standard library only).

## Data

Sample household figures for November 2026 (the family is fictional, the arithmetic is real):

- Take-home pay $5,400.00 (Dewi $2,900 + Andi $2,300 + child benefit $200).
- November: spent $4,229.94, saved $1,000.00, left $170.06. Planned total $5,400.00.
- 50/30/20 split: needs $3,342.70 (61.9%), wants $887.24 (16.4%), savings $1,000.00 (18.5%).
- Most over budget: Utilities, $371.95 against a $220 plan (+$151.95). Most under: Gifts & Giving, $95.00 against $200 (−$105.00).
- Goals: Emergency fund $6,400/$10,000 · Family holiday $1,850/$3,000 · New fridge $780/$1,200 · Kids' education $2,300/$5,000.
- Bills: 6 of 8 paid; unpaid: home insurance $145.00 (due 20 Nov) and school fees $240.00 (due 25 Nov).

## License

MIT — see `LICENSE`.
