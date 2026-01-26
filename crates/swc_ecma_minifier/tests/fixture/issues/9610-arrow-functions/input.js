// Test: Arrow functions with unused default parameters

const defaultValue = 100;

// Unused default param at end should be removed
const foo = (a, b = defaultValue) => a;

// Unused default param in middle - params after should also be removed
const bar = (a, b = 10, c = 20) => a;

// Used default param should be kept
const baz = (a, b = 5) => a + b;

// Multiple default params, only last unused
const qux = (a, b = 1, c = 2) => a + b;

export const example = () => foo(1) + bar(2) + baz(3) + qux(4);
