# Lotus LP Rewards Calculator

Interactive calculator for showing prospective LPs their potential LOTUS token earnings.

## Quick Start

1. Open `lotus-lp-calculator.html` in any web browser (Chrome, Firefox, Safari, etc.)
2. No installation or internet connection required - it's a single self-contained file
3. Adjust the inputs to show prospects their potential returns

## How to Use

### Inputs

**Your LP Commitment ($)**
- The amount the prospect will provide to Lotus
- Default: $15M

**Your Lending Strategy**
- Conservative (5% APR): Lower risk, lower returns
- Balanced (8% APR): Medium risk, medium returns
- Aggressive (12% APR): Higher risk, higher returns
- Default: Balanced

**Total Private LP Pool ($)**
- Total commitments from all private LPs combined
- This affects the reward tiers and distribution
- Default: $115M

**Estimated Average Market APR (%)**
- The expected average lending rate across all other LPs
- Used to calculate the prospect's share of rewards
- Default: 8%

**Target LOTUS FDV ($)**
- The projected Fully Diluted Valuation of LOTUS tokens
- Used to calculate USD value of token rewards
- 100M total token supply
- Default: $200M ($2.00 per token)

### Outputs

**Total LOTUS Tokens Earned**
- Total tokens over the 8-month commitment period
- Shows USD value at the target FDV

**Pre-Deposit Phase vs Post-Launch Phase**
- Breakdown of tokens earned in each phase
- Pre-deposit: 2 months (4 two-week epochs)
- Post-launch: 6 months (12 two-week epochs)

**Effective APY**
- Annualized return including both:
  - Lending interest earned
  - LOTUS token rewards
- Helps compare to other DeFi opportunities

## Key Details

### Program Structure
- **Duration:** 8 months total commitment
- **Pre-Deposit Phase:** 2 months before market launch
- **Post-Launch Phase:** 6 months after market launch
- **Distribution:** Every 2 weeks (epoch-based)

### Reward Distribution
- Rewards are distributed proportionally based on each LP's share of total interest earned
- More aggressive lending (higher APR) = more interest = larger share of rewards
- As total pool grows beyond $50M, $100M, $200M thresholds, marginal reward rates decline for additional capital

### Tiered Rate Schedule

The reward rates apply to tranches of the total pool size. As the pool grows, marginal rates decline:

**Pre-Deposit (bps per $1M per epoch):**
- First $50M of pool: 1.7 bps/$1M
- Next $50M ($50-100M): 1.4 bps/$1M
- Next $100M ($100-200M): 1.1 bps/$1M
- Next $200M ($200-400M): 0.86 bps/$1M

**Post-Launch (bps per $1M per epoch):**
- First $50M of pool: 4.3 bps/$1M
- Next $50M ($50-100M): 3.6 bps/$1M
- Next $100M ($100-200M): 2.9 bps/$1M
- Next $200M ($200-400M): 2.14 bps/$1M

All LPs share proportionally in the total reward pool based on their contribution to total interest earned.

### Interest Calculation Notes
- The calculator uses credit spread (APR minus 3% RFR) for reward distribution
- Display shows full APR for simplicity
- Conservative 5% → 2% credit spread
- Balanced 8% → 5% credit spread
- Aggressive 12% → 9% credit spread

## Example Scenarios

### Scenario 1: $15M LP, Conservative Strategy
- LP Amount: $15M
- Strategy: Conservative (5% APR)
- Total Pool: $115M
- Market APR: 8%
- FDV: $200M

**Result:** ~3.2M LOTUS tokens (~$6.4M value), ~85% APY

### Scenario 2: $50M LP, Aggressive Strategy
- LP Amount: $50M
- Strategy: Aggressive (12% APR)
- Total Pool: $200M
- Market APR: 8%
- FDV: $200M

**Result:** Higher token earnings due to larger size and more aggressive lending

## Tips for BD Presentations

1. **Start with default values** to show a baseline scenario
2. **Adjust LP amount** to match the prospect's capacity
3. **Show different strategies** to demonstrate how aggressiveness affects returns
4. **Vary the FDV** to show upside/downside scenarios
5. **Highlight the APY** as the key comparison metric

## Testing

Run `node test-calculations.js` to verify the calculation logic with multiple test scenarios.

## Technical Notes

- Single-file HTML/CSS/JavaScript application
- No external dependencies
- Works offline
- Compatible with all modern browsers
- Updates calculations in real-time as inputs change

---

For questions or updates to the reward schedule, contact the Lotus team.
