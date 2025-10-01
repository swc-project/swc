// Test case for merging duplicate imports from the same module
import { add } from 'math-library';
import { subtract, multiply } from 'math-library';
import { add as addAgain } from 'math-library';
import { divide } from 'math-library';

// Should merge into: import { add, subtract, multiply, divide } from 'math-library';
// Note: add as addAgain should be kept separate since it's aliased

export function calculator(a, b) {
    return {
        sum: add(a, b),
        diff: subtract(a, b), 
        product: multiply(a, b),
        quotient: divide(a, b),
        sumAlias: addAgain(a, b)
    };
}