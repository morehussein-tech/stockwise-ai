# StockWise AI

StockWise AI is a restaurant inventory, wastage, and menu-profitability assistant built for OpenAI Build Week. It turns operational records into verified calculations and then uses GPT-5.6 to explain what management should do next.

## Why it exists

Many small restaurants manage purchases, recipes, sales, and stock in separate notebooks or spreadsheets. That makes it hard to see expected stock, catch wastage early, or know which menu items truly contribute profit.

StockWise AI demonstrates a safer pattern for business AI:

1. Deterministic code calculates stock balances, wastage cost, revenue, food cost, profit, and margin.
2. The application prepares a structured prompt containing only the verified summary.
3. The user hands that prompt to GPT-5.6 in ChatGPT for a concise management brief.
4. The interface reminds users to verify expected stock with a physical count.

## Core features

- Executive dashboard with revenue, gross profit, waste cost, and reorder alerts
- Expected inventory balance using opening + purchases - consumption - wastage
- Low-stock and watch-level flags
- Menu contribution and gross-margin analysis
- GPT-5.6 management-brief handoff grounded in calculated figures
- Responsive interface for desktop and mobile
- Built-in sample restaurant dataset for judging

## How Codex was used

Codex was the main development environment for the project. It helped translate an existing Excel and Power Query restaurant-control workflow into a web product, define the smallest judge-ready scope, implement the calculation layer and interface, design the GPT-5.6 handoff, run production builds, and verify the result.

Key decisions made with Codex included:

- separating numerical calculations from AI interpretation;
- using expected-stock wording and physical-count warnings to avoid false certainty;
- focusing the first prototype on stock, wastage, profitability, and daily actions;
- using Ugandan restaurant examples and UGX so the demonstration reflects a real operating context.

## How GPT-5.6 is used

The AI Brief screen creates a compact, structured prompt containing:

- calculated performance totals;
- low-stock items and reorder thresholds;
- highest-value wastage items;
- menu revenue, profit, and margin.

The user copies this grounded prompt into GPT-5.6 in ChatGPT. The prompt requires the model to use only supplied figures, avoid unsupported causes, use UGX, and return four action-focused sections. This human-in-the-loop design uses the participant's existing ChatGPT access, avoids exposing API credentials, and keeps the numerical source of truth visible for verification.

## Run locally

Requirements: Node.js 20+ and ChatGPT access to complete the optional GPT-5.6 brief handoff.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production build

```bash
npm run build
npm start
```

For a Cloudflare Worker-compatible deployment bundle:

```bash
npm run build:site
```

## Technology

- Next.js 15
- React 19
- TypeScript
- GPT-5.6 through a transparent ChatGPT handoff
- Recharts
- Lucide icons

## Data and safety notes

The public demonstration uses fictional sample data and does not contain customer or employee information. Stock balances are estimates derived from operational records. A physical count remains the source of truth for purchasing and control decisions.

## Next steps

- CSV/Excel imports for the five operating tables
- physical-count variance reconciliation
- editable recipes and reorder levels
- multi-branch views
- supplier and purchase-order workflows
- demand forecasting after enough historical data is available
