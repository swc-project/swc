import { add, subtract, multiply, divide } from 'math-library';
import { add as addAgain } from 'math-library';
export function calculator(a, b) {
    return {
        sum: add(a, b),
        diff: subtract(a, b),
        product: multiply(a, b),
        quotient: divide(a, b),
        sumAlias: addAgain(a, b)
    };
}