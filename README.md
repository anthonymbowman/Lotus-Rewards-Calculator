# Lotus LP Rewards Calculator

Interactive calculator for showing private LPs their estimated LOTUS rewards using the current assumptions in `Lotus Incentives Plan.md`.

## Quick Start

1. Open `index.html` in any modern browser.
2. No install step is required; this is a single self-contained page.
3. Use the phase toggle, inputs, and assumptions to model rewards.

## What Changed

- Added a phase toggle: **Pre-Deposit Vaults** vs **Post-Launch**.
- Added an in-page LP program explainer at the top of the calculator.
- Added post-launch advanced assumptions (collapsible):
  - `Estimated Average Market APR (%)`
  - `Base Rate / RFR (%)`
- Added a selected-phase output view plus a compact full-program summary.

## Inputs

### Available in both phases

- **Your LP Commitment**
- **Total Private LP Supply**
- **Target LOTUS FDV**

### Post-launch only

- **Your Lending Strategy** (Conservative / Balanced / Aggressive)
- **Advanced assumptions** (collapsible)
  - Market APR (default `6.6%`)
  - Base Rate / RFR (default `3.0%`)

## MD-Aligned Reward Schedule

Source: `Lotus Incentives Plan.md`

- **Epoch length:** 2 weeks
- **Pre-Deposit:** 4 epochs
- **Post-Launch:** 13 epochs
- **Total program horizon for summary:** 17 epochs

### Pre-Deposit rates (bp per $1M per epoch)

- `0-50M`: `0.4250`
- `50-100M`: `0.3500`
- `100-200M`: `0.2750`

### Post-Launch rates (bp per $1M per epoch)

- `0-50M`: `0.3310`
- `50-100M`: `0.2770`
- `100-200M`: `0.2230`

## Assumptions

- The calculator uses a **flat bracket rate by total pool size** for each phase.
- Pre-deposit rewards are split by LP share of total private pool.
- Post-launch rewards are split by LP share of spread interest (APR minus base rate).
- Selected-phase APY is phase-specific.
- Full-program APY combines both phases (4 + 13 epochs).
- If total private LP supply is above `$200M`, the estimator uses the last published bracket rate (`100-200M`) until a newer schedule is provided.

## Validation Rules

- `lpAmount > 0`
- `totalPool > 0`
- `lpAmount <= totalPool`
- `fdv > 0`
- `marketAPR >= 0`
- `baseRate >= 0`

## Testing

Run:

```bash
node test-calculations.js
```

The test script verifies MD example alignment and key invariants, including:

- Pre-deposit `$40M` example -> `17 bp` pool reward per epoch
- Post-launch LP1-style `$115M` scenario around `0.26%` total supply over 13 epochs
- Full total equals pre + post totals
- Share and spread-floor edge cases
