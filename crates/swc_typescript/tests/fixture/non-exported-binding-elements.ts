// Correct
const [A, B] = [1, 2, 3];
export function foo(): number {
    return A;
}

// Incorrect
const { c, d } = { c: 1, d: 2 };
const [ e ] = [4];
export { c, d, e }

export const { f, g } = { f: 5, g: 6 };
