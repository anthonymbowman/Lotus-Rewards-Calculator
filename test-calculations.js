// Test calculations for Lotus LP Calculator
// Run with: node test-calculations.js

const REWARD_SCHEDULE = {
    preDeposit: [
        { max: 50000000, rate: 1.7 },
        { max: 100000000, rate: 1.4 },
        { max: 200000000, rate: 1.1 },
        { max: 400000000, rate: 0.86 }
    ],
    postLaunch: [
        { max: 50000000, rate: 4.3 },
        { max: 100000000, rate: 3.6 },
        { max: 200000000, rate: 2.9 },
        { max: 400000000, rate: 2.14 }
    ]
};

const TOTAL_LOTUS_SUPPLY = 100000000;
const PRE_DEPOSIT_EPOCHS = 4;
const POST_LAUNCH_EPOCHS = 12;
const WEEKS_PER_EPOCH = 2;
const WEEKS_PER_YEAR = 52;

function calculateTieredAllocation(totalPool, schedule) {
    let remaining = totalPool;
    let totalBps = 0;
    const breakdown = [];

    for (const tier of schedule) {
        if (remaining <= 0) break;

        const prevMax = tier === schedule[0] ? 0 : schedule[schedule.indexOf(tier) - 1].max;
        const tierSize = tier.max - prevMax;
        const amount = Math.min(remaining, tierSize);

        const bps = (amount / 1000000) * tier.rate;
        totalBps += bps;
        breakdown.push({ amount, rate: tier.rate, bps });
        remaining -= amount;
    }

    return { totalBps, breakdown };
}

function calculateInterestPerEpoch(principal, aprPercent) {
    const annualInterest = principal * (aprPercent / 100);
    return annualInterest * (WEEKS_PER_EPOCH / WEEKS_PER_YEAR);
}

function formatNumber(num) {
    return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

// Test Case 1: $115M total pool, similar to the example
console.log('=== Test Case 1: $115M Total Pool ===\n');

const totalPool = 115000000;
const preDepositCalc = calculateTieredAllocation(totalPool, REWARD_SCHEDULE.preDeposit);
const postLaunchCalc = calculateTieredAllocation(totalPool, REWARD_SCHEDULE.postLaunch);

console.log('Total Pool: $' + formatNumber(totalPool));
console.log('\nPre-Deposit Allocation:');
preDepositCalc.breakdown.forEach((tier, i) => {
    console.log(`  Tier ${i + 1}: $${formatNumber(tier.amount)} @ ${tier.rate} bps/$1M = ${tier.bps.toFixed(2)} bps`);
});
console.log(`  Total: ${preDepositCalc.totalBps.toFixed(2)} bps = ${(preDepositCalc.totalBps / 100).toFixed(4)}% per epoch`);

console.log('\nPost-Launch Allocation:');
postLaunchCalc.breakdown.forEach((tier, i) => {
    console.log(`  Tier ${i + 1}: $${formatNumber(tier.amount)} @ ${tier.rate} bps/$1M = ${tier.bps.toFixed(2)} bps`);
});
console.log(`  Total: ${postLaunchCalc.totalBps.toFixed(2)} bps = ${(postLaunchCalc.totalBps / 100).toFixed(4)}% per epoch`);

// Test LP calculations
const lp1Amount = 15000000;
const lp1ActualAPR = 2; // Conservative (5% display - 3% RFR)
const othersAmount = totalPool - lp1Amount;
const othersAPR = 5.25; // Average of 5% and 7% (Balanced and Aggressive minus RFR)

const lp1Interest = calculateInterestPerEpoch(lp1Amount, lp1ActualAPR);
const othersInterest = calculateInterestPerEpoch(othersAmount, othersAPR);
const totalInterest = lp1Interest + othersInterest;

console.log('\n=== LP Rewards (per epoch) ===');
console.log(`LP1: $${formatNumber(lp1Amount)} @ ${lp1ActualAPR}% actual APR`);
console.log(`  Interest per epoch: $${formatNumber(lp1Interest)}`);
console.log(`  Share of total interest: ${(lp1Interest / totalInterest * 100).toFixed(2)}%`);

const preDepositLotusPerEpoch = (preDepositCalc.totalBps / 100) * TOTAL_LOTUS_SUPPLY / 100;
const postLaunchLotusPerEpoch = (postLaunchCalc.totalBps / 100) * TOTAL_LOTUS_SUPPLY / 100;

const lp1PreDepositLotus = preDepositLotusPerEpoch * (lp1Interest / totalInterest);
const lp1PostLaunchLotus = postLaunchLotusPerEpoch * (lp1Interest / totalInterest);

console.log(`\n  Pre-Deposit LOTUS per epoch: ${formatNumber(lp1PreDepositLotus)} (${(lp1PreDepositLotus / TOTAL_LOTUS_SUPPLY * 100).toFixed(4)}%)`);
console.log(`  Post-Launch LOTUS per epoch: ${formatNumber(lp1PostLaunchLotus)} (${(lp1PostLaunchLotus / TOTAL_LOTUS_SUPPLY * 100).toFixed(4)}%)`);

const totalPreDeposit = lp1PreDepositLotus * PRE_DEPOSIT_EPOCHS;
const totalPostLaunch = lp1PostLaunchLotus * POST_LAUNCH_EPOCHS;
const totalLotus = totalPreDeposit + totalPostLaunch;

console.log(`\n=== Total Over 8 Months ===`);
console.log(`Pre-Deposit (4 epochs): ${formatNumber(totalPreDeposit)} LOTUS`);
console.log(`Post-Launch (12 epochs): ${formatNumber(totalPostLaunch)} LOTUS`);
console.log(`TOTAL: ${formatNumber(totalLotus)} LOTUS`);

// Calculate value and APY
const fdv = 200000000;
const tokenPrice = fdv / TOTAL_LOTUS_SUPPLY;
const lotusValue = totalLotus * tokenPrice;

const lp1DisplayAPR = 5; // Conservative shows 5%
const totalLendingInterest = calculateInterestPerEpoch(lp1Amount, lp1DisplayAPR) * (PRE_DEPOSIT_EPOCHS + POST_LAUNCH_EPOCHS);
const totalReturn = totalLendingInterest + lotusValue;
const durationYears = ((PRE_DEPOSIT_EPOCHS + POST_LAUNCH_EPOCHS) * WEEKS_PER_EPOCH) / WEEKS_PER_YEAR;
const simpleReturn = totalReturn / lp1Amount;
const apy = (Math.pow(1 + simpleReturn, 1 / durationYears) - 1) * 100;

console.log(`\nToken Price: $${tokenPrice.toFixed(2)} (FDV: $${formatNumber(fdv)})`);
console.log(`LOTUS Value: $${formatNumber(lotusValue)}`);
console.log(`Lending Interest (8 months): $${formatNumber(totalLendingInterest)}`);
console.log(`Total Return: $${formatNumber(totalReturn)}`);
console.log(`Effective APY: ${apy.toFixed(2)}%`);

// Test Case 2: Smaller LP in larger pool
console.log('\n\n=== Test Case 2: $10M LP in $200M Pool ===\n');

const totalPool2 = 200000000;
const lp2Amount = 10000000;
const lp2ActualAPR = 5; // Balanced
const others2Amount = totalPool2 - lp2Amount;
const others2APR = 3.5; // Conservative average

const preDepositCalc2 = calculateTieredAllocation(totalPool2, REWARD_SCHEDULE.preDeposit);
const postLaunchCalc2 = calculateTieredAllocation(totalPool2, REWARD_SCHEDULE.postLaunch);

const lp2Interest = calculateInterestPerEpoch(lp2Amount, lp2ActualAPR);
const others2Interest = calculateInterestPerEpoch(others2Amount, others2APR);
const totalInterest2 = lp2Interest + others2Interest;

const preDepositLotusPerEpoch2 = (preDepositCalc2.totalBps / 100) * TOTAL_LOTUS_SUPPLY / 100;
const postLaunchLotusPerEpoch2 = (postLaunchCalc2.totalBps / 100) * TOTAL_LOTUS_SUPPLY / 100;

const lp2PreDepositLotus = preDepositLotusPerEpoch2 * (lp2Interest / totalInterest2);
const lp2PostLaunchLotus = postLaunchLotusPerEpoch2 * (lp2Interest / totalInterest2);

const totalLotus2 = (lp2PreDepositLotus * PRE_DEPOSIT_EPOCHS) + (lp2PostLaunchLotus * POST_LAUNCH_EPOCHS);
const lotusValue2 = totalLotus2 * tokenPrice;

console.log(`Total Pool: $${formatNumber(totalPool2)}`);
console.log(`Your LP: $${formatNumber(lp2Amount)} @ ${lp2ActualAPR + 3}% APR (${lp2ActualAPR}% credit spread)`);
console.log(`Your share of interest: ${(lp2Interest / totalInterest2 * 100).toFixed(2)}%`);
console.log(`\nTotal LOTUS earned: ${formatNumber(totalLotus2)} LOTUS`);
console.log(`Value: $${formatNumber(lotusValue2)}`);

const totalLendingInterest2 = calculateInterestPerEpoch(lp2Amount, lp2ActualAPR + 3) * (PRE_DEPOSIT_EPOCHS + POST_LAUNCH_EPOCHS);
const totalReturn2 = totalLendingInterest2 + lotusValue2;
const simpleReturn2 = totalReturn2 / lp2Amount;
const apy2 = (Math.pow(1 + simpleReturn2, 1 / durationYears) - 1) * 100;
console.log(`Effective APY: ${apy2.toFixed(2)}%`);

console.log('\n✓ Calculations complete');
