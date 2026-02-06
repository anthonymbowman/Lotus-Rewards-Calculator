# Lotus Incentives Plan

# Executive summary

The incentives plan has two phases:

* **Pre-Deposit Rewards**: before borrowing is enabled, users deposit USDC into pre-deposit vaults. Rewards are emitted to suppliers only.  
* **Market Rewards**: once borrowing is enabled, emissions are split between lenders and borrowers, gradually shifting toward borrowers.

A separate rewards category is reserved for private LPs. They will not participate in the public rewards.

# Token Transferability

Until token transferability, the LOTUS token will only be transferable from the LOTUS admin and whitelisted addresses. The whitelisted addresses include the Lotus Admin and the Merkl Distributor Contract. More addresses can be added by the Lotus Admin.

Transferability will require a proposal from the Governance Council and a tokenholder vote. The Governance Council estimates transferability will be enabled between 6 and 12 months following the full public launch of Lotus.

# Pre-Deposit Rewards (4 Epochs)

Before borrowing is enabled, users can supply USDC to pre-deposit vaults to earn real yield and Lotus Rewards. During pre-deposit, vaults are allocated to LotusUSD and earn a real yield equal to the base rate. A fixed amount of LOTUS is split proportionally across all depositors, regardless of the vault chosen. 

The incentive rate will be shown as a number of LOTUS per $1,000 deposited per year.  For example, if the rate is 125 LOTUS,  a user who deposits $1,000 USDC will earn \~4.81 LOTUS per epoch. `125 LOTUS / 26 epochs per year = ~4.81`

The total amount of LOTUS per 2-week epoch will be capped at 750,000 LOTUS, and the rate will be capped at 125 LOTUS. This amount implies at 25% incentive APR at a $200m valuation.

After each epoch, each depositor will receive a share of the rewards proportional to its time-weighted average of assets (i.e., vaultShares \* shareAssetConversionRate) across all vaults. 

The rewards will be distributed via Merkl to Lotus vault shareholders, unless the holder is a whitelisted contract. For example, if a non-Lotus vault is allocated to a Lotus vault, the non-Lotus vault contract would receive no rewards. The shareholders of the non-Lotus vault would receive a proportional amount of rewards using the same methodology.

# Market Rewards

Once borrowing is enabled, pre-deposit rewards are replaced by a system that incentivizes both lenders and borrowers. Each epoch, a fixed amount of LOTUS is available to borrowers and a fixed amount to lenders, split proportionally based on the supply interest earned and the borrower interest paid (excluding base rate). Incentives initially favor supply, then shift toward borrowers over time.

The total amount of rewards available each epoch will be capped at:

`epochRewardCap = 875,000 *  0.9^(epochNumber - 5)`

The total rewards cap will start at 875,000 and decrease by 10% per epoch. The suggested epoch reward amount will be:

`totalEligibleDollars = supply + borrow - privateLPSupply`  
`weightedAverageIncentives = 0.2  *  0.9^(epochNumber - 5)`  
`fdvTVLmultiplier = IF(epochNumber >= 72,  0.1, POWER(0.1, (epochNumber - 1)/ 71))`  
`estimatedFDV = max(200000000, tvl * fdvTVLmultiplier)`  
`suggestedEpochRewards = (totalEligibleDollars * weightedAverageIncentive / 26) / (estimatedFDV / 100000000)`

The amount of rewards will be set for each epoch as:

`epochRewards = MIN(suggestedEpochRewards, epochRewardCap)`

The rewards will be split by borrowers and lenders with the fixed amounts as follows:

`lenderEpochSplit = MAX(0, 1 - supplyAmount / 400000000)`  
`lenderEpochRewards = lenderEpochSplit * epochRewards`  
`borrowEpochRewards = (1 - lenderEpochSplit) * epochRewards`

For lenders, the rewards will be split proportionally based on the interest earned (excluding the base rate) over the epoch. For borrowers, the rewards will be split proportionally based on the interest paid (excluding the base rate) over the epoch.

Rewards will be distributed after each epoch on Merkl.

# LP Deals

Private LPs must sign an agreement and deposit into a pre-deposit vault before the conclusion of epoch 4\. Private LPs will be guaranteed the rewards schedule outlined below.

The total amount of rewards will be determined by the daily average TVL in the private LP rewards program. During the predeposit phase, the total rewards will be distributed proportionally based on daily average TVL. During the Post-Launch phase, total rewards will be distributed proportionally to the interest earned (excluding the base rate) during the epoch. At the end of each epoch, the total amount of interest earned will be calculated. This ensures a fair distribution of risk vs. reward.

Rewards will be distributed on Merkl.

**Rewards Schedule**

| Total LP Supply | Pre-Deposit \- 4 epochs (bps/$1m) | Post-Launch \- 13 epochs (bps/$1m) |
| :---- | :---- | :---- |
| $0-50m (6bps) | 0.4250 bp / $1m / epoch | 0.331 bp / $1m / epoch |
| $50-100m (5bps) | 0.3500 bp / $1m / epoch | 0.277 bp / $1m / epoch |
| $100-200m (3bps) | 0.2750 bp / $1m / epoch | 0.223 bp / $1m / epoch |

**Pre-Launch Rewards Example:** If the daily average TVL is $40m, the reward rate in the predeposit phase would be 0.4250 bp per $1m of the total supply. Therefore, the total rewards for the epoch would be 0.4250 \* 40 \= 17 bp of total supply. This will be distributed proportionately to all private LPs based on their average TVL.

**Post-Launch Rewards Example:**

| Total LP | $115m | % of LOTUS / Epoch | 0.26% |  |  |  |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **LP** | **Deposit Amount** | **APR** | **Interest Earned in Epoch** | **% of Interest Earned** | **Epoch Rewards (% of total supply)** | **Post-Launch Reward Total (13 epochs)** |
| 1 | $15m | 5% | $28,846 | 7.89% | 0.02% | 0.26% |
| 2 | $50m | 7.50% | $144,231 | 39.47% | 0.10% | 1.32% |
| 3 | $50m | 10% | $192,308 | 52.63% | 0.14% | 1.76% |
| **Total** | $115m |  | $365,385 | 100.00% | 0.26% | 3.34% |

