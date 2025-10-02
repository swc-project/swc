import { add, subtract, multiply, divide, pow } from 'math-library';
export function calculator(a, b) {
    return {
        sum: add(a, b),
        diff: subtract(a, b),
        product: multiply(a, b),
        quotient: divide(a, b),
        power: pow(a, b),
        diffAlias: subtract(a, b)
    };
}