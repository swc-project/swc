// Test case for merging duplicate imports from the same module
import { add } from 'math-library';
import { subtract, multiply } from 'math-library';
import { divide } from 'math-library';
import { subtract as subAlias } from 'math-library';
import { pow } from 'math-library';

// Should merge duplicate imports intelligently:
// - subtract and subtract as subAlias should merge to 'subtract' (prefer non-aliased)
// - All imports should be merged into single import statement

export function calculator(a, b) {
    return {
        sum: add(a, b),
        diff: subtract(a, b), 
        product: multiply(a, b),
        quotient: divide(a, b),
        power: pow(a, b),
        diffAlias: subtract(a, b) // Using the non-aliased name
    };
}