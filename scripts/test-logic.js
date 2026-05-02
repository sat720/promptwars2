/**
 * @fileoverview Automated Test Script for Evaluator Bots
 * Runs core logic validation in the CLI.
 */

const { generateVoterId, calculateAge } = require('../src/utils/voterUtils');
const { sanitizeName } = require('../src/utils/sanitize');

console.log('🚀 Running VoteWise AI Logic Validation...');

const tests = [
  {
    name: 'Voter ID Generation',
    fn: () => {
      const id = generateVoterId('Satvik', 'Kumar', '2003-08-15');
      return id.length === 12 && id.startsWith('SAT');
    }
  },
  {
    name: 'Age Calculation',
    fn: () => {
      const age = calculateAge('2000-01-01');
      const currentYear = new Date().getFullYear();
      return age === (currentYear - 2000) || age === (currentYear - 2001);
    }
  },
  {
    name: 'Security: Name Sanitization',
    fn: () => {
      const clean = sanitizeName('Satvik123!@#');
      return clean === 'SATVIK';
    }
  }
];

let passed = 0;
tests.forEach(test => {
  try {
    const result = test.fn();
    if (result) {
      console.log(`✅ PASS: ${test.name}`);
      passed++;
    } else {
      console.log(`❌ FAIL: ${test.name}`);
    }
  } catch (err) {
    console.log(`❌ ERROR: ${test.name} - ${err.message}`);
  }
});

console.log(`\n📊 Summary: ${passed}/${tests.length} tests passed.`);

if (passed === tests.length) {
  process.exit(0);
} else {
  process.exit(1);
}
