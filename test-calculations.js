// Lotus LP calculator validation tests
// Run with: node test-calculations.js

const assert = require('assert');

const REWARD_SCHEDULE = {
    preDeposit: [
        { max: 50000000, rate: 0.4250 },
        { max: 100000000, rate: 0.3500 },
        { max: 200000000, rate: 0.2750 }
    ],
    postLaunch: [
        { max: 50000000, rate: 0.3310 },
        { max: 100000000, rate: 0.2770 },
        { max: 200000000, rate: 0.2230 }
    ]
};

const TOTAL_LOTUS_SUPPLY = 100000000;
const WEEKS_PER_EPOCH = 2;
const WEEKS_PER_YEAR = 52;
const PRE_DEPOSIT_EPOCHS = 4;
const POST_LAUNCH_EPOCHS = 13;

function getBracketRate(totalPool, schedule) {
    for (const tier of schedule) {
        if (totalPool <= tier.max) {
            return tier.rate;
        }
    }
    return schedule[schedule.length - 1].rate;
}

function calculatePoolEpoch(totalPool, schedule) {
    const rate = getBracketRate(totalPool, schedule);
    const poolEpochBps = (totalPool / 1000000) * rate;
    const poolEpochTokens = (poolEpochBps / 10000) * TOTAL_LOTUS_SUPPLY;

    return {
        rate,
        poolEpochBps,
        poolEpochTokens
    };
}

function calculatePreDeposit(inputs) {
    const durationYears = (PRE_DEPOSIT_EPOCHS * WEEKS_PER_EPOCH) / WEEKS_PER_YEAR;
    const poolEpoch = calculatePoolEpoch(inputs.totalPool, REWARD_SCHEDULE.preDeposit);
    const userShare = inputs.lpAmount / inputs.totalPool;
    const epochTokens = poolEpoch.poolEpochTokens * userShare;
    const tokens = epochTokens * PRE_DEPOSIT_EPOCHS;
    const valueUSD = tokens * inputs.tokenPrice;

    const phaseAPR = inputs.baseRate;
    const lendingInterest = inputs.lpAmount * (phaseAPR / 100) * durationYears;
    const phaseReturn = (lendingInterest + valueUSD) / inputs.lpAmount;
    const apy = (Math.pow(1 + phaseReturn, 1 / durationYears) - 1) * 100;

    return {
        tokens,
        valueUSD,
        apy,
        epochTokens,
        userShare,
        lendingInterest,
        poolEpochBps: poolEpoch.poolEpochBps
    };
}

function calculatePostLaunch(inputs) {
    const durationYears = (POST_LAUNCH_EPOCHS * WEEKS_PER_EPOCH) / WEEKS_PER_YEAR;
    const poolEpoch = calculatePoolEpoch(inputs.totalPool, REWARD_SCHEDULE.postLaunch);

    const userSpreadAPR = Math.max(0, inputs.strategyAPR - inputs.baseRate);
    const marketSpreadAPR = Math.max(0, inputs.marketAPR - inputs.baseRate);

    const userInterestEpoch = inputs.lpAmount * (userSpreadAPR / 100) * (WEEKS_PER_EPOCH / WEEKS_PER_YEAR);
    const otherInterestEpoch = (inputs.totalPool - inputs.lpAmount) * (marketSpreadAPR / 100) * (WEEKS_PER_EPOCH / WEEKS_PER_YEAR);
    const totalInterestEpoch = userInterestEpoch + otherInterestEpoch;

    const userShare = totalInterestEpoch > 0 ? userInterestEpoch / totalInterestEpoch : 0;
    const epochTokens = poolEpoch.poolEpochTokens * userShare;
    const tokens = epochTokens * POST_LAUNCH_EPOCHS;
    const valueUSD = tokens * inputs.tokenPrice;

    const phaseAPR = inputs.strategyAPR;
    const lendingInterest = inputs.lpAmount * (phaseAPR / 100) * durationYears;
    const phaseReturn = (lendingInterest + valueUSD) / inputs.lpAmount;
    const apy = (Math.pow(1 + phaseReturn, 1 / durationYears) - 1) * 100;

    return {
        tokens,
        valueUSD,
        apy,
        epochTokens,
        userShare,
        lendingInterest,
        poolEpochBps: poolEpoch.poolEpochBps,
        userSpreadAPR,
        marketSpreadAPR
    };
}

function calculateFullProgram(inputs, preResult, postResult) {
    const totalTokens = preResult.tokens + postResult.tokens;
    const totalValueUSD = preResult.valueUSD + postResult.valueUSD;
    const totalDurationYears = ((PRE_DEPOSIT_EPOCHS + POST_LAUNCH_EPOCHS) * WEEKS_PER_EPOCH) / WEEKS_PER_YEAR;

    const totalLendingInterest = preResult.lendingInterest + postResult.lendingInterest;
    const totalReturn = (totalLendingInterest + totalValueUSD) / inputs.lpAmount;
    const totalAPY = (Math.pow(1 + totalReturn, 1 / totalDurationYears) - 1) * 100;

    return {
        totalTokens,
        totalValueUSD,
        totalAPY,
        pre: preResult,
        post: postResult
    };
}

function approxEqual(a, b, epsilon = 1e-6) {
    return Math.abs(a - b) <= epsilon;
}

function runTests() {
    const baseInputs = {
        lpAmount: 15000000,
        totalPool: 115000000,
        tokenPrice: 2.0,
        strategyAPR: 5,
        marketAPR: 8,
        baseRate: 3
    };

    // 1) MD pre-deposit example: $40m pool -> 17 bp per epoch
    {
        const poolEpoch = calculatePoolEpoch(40000000, REWARD_SCHEDULE.preDeposit);
        assert(approxEqual(poolEpoch.poolEpochBps, 17, 1e-9), 'Expected 17 bp for $40m pre-deposit pool');
        console.log('✓ Pre-deposit MD example matched: $40m => 17 bp/epoch');
    }

    // 2) MD post-launch LP1-style example around 0.26% of supply over 13 epochs
    {
        const mdStyleInputs = {
            ...baseInputs,
            // Calibrated to the LP1 interest-share example under spread-based allocation.
            marketAPR: 6.5
        };
        const post = calculatePostLaunch(mdStyleInputs);
        const pctSupply = (post.tokens / TOTAL_LOTUS_SUPPLY) * 100;
        // MD example rounds heavily; allow reasonable tolerance
        assert(Math.abs(pctSupply - 0.26) <= 0.02, `Expected ~0.26% of supply, got ${pctSupply.toFixed(4)}%`);
        console.log('✓ Post-launch MD LP1-style example in expected range (~0.26% of supply)');
    }

    // 3) Full program token total must equal sum of phases
    {
        const pre = calculatePreDeposit(baseInputs);
        const post = calculatePostLaunch(baseInputs);
        const full = calculateFullProgram(baseInputs, pre, post);
        assert(approxEqual(full.totalTokens, pre.tokens + post.tokens, 1e-9), 'Full total tokens mismatch');
        console.log('✓ Full program total equals pre + post tokens');
    }

    // 4) lpAmount === totalPool should yield userShare 100% in pre-deposit
    {
        const samePoolInputs = {
            ...baseInputs,
            lpAmount: 50000000,
            totalPool: 50000000
        };
        const pre = calculatePreDeposit(samePoolInputs);
        assert(approxEqual(pre.userShare, 1, 1e-12), 'Expected pre-deposit userShare of 100%');
        console.log('✓ lpAmount === totalPool gives 100% pre-deposit share');
    }

    // 5) low APR floors spreads to zero; post-launch zero-safe share fallback
    {
        const lowAprInputs = {
            ...baseInputs,
            strategyAPR: 2,
            marketAPR: 2,
            baseRate: 3
        };
        const post = calculatePostLaunch(lowAprInputs);
        assert(approxEqual(post.userSpreadAPR, 0, 1e-12), 'Expected user spread floor at zero');
        assert(approxEqual(post.marketSpreadAPR, 0, 1e-12), 'Expected market spread floor at zero');
        assert(approxEqual(post.userShare, 0, 1e-12), 'Expected zero-safe userShare fallback to zero');
        assert(approxEqual(post.tokens, 0, 1e-9), 'Expected zero post-launch tokens when all spreads are zero');
        console.log('✓ Spread floor and zero-safe share behavior verified');
    }

    // 6) Above-$200m extrapolation should use last published bracket rate
    {
        const preRate = getBracketRate(350000000, REWARD_SCHEDULE.preDeposit);
        const postRate = getBracketRate(350000000, REWARD_SCHEDULE.postLaunch);
        assert(approxEqual(preRate, 0.2750, 1e-12), 'Expected pre-deposit extrapolation to use 0.2750');
        assert(approxEqual(postRate, 0.2230, 1e-12), 'Expected post-launch extrapolation to use 0.2230');
        console.log('✓ Above-$200m uses last published bracket rate');
    }

    console.log('\nAll tests passed.');
}

runTests();
