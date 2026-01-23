// Test: Destructuring patterns with default values

// Object destructuring with default - unused
function foo({ a, b = 10 }) {
    return a;
}

// Object destructuring with default - used
function bar({ a, b = 20 }) {
    return a + b;
}

// Array destructuring with default - unused
function baz([a, b = 30]) {
    return a;
}

// Array destructuring with default - used
function qux([a, b = 40]) {
    return a + b;
}

// Combined: regular param and destructuring with defaults
function combined(x, { a, b = 50 }, c = 60) {
    return x + a;
}

export function example() {
    return foo({ a: 1 }) + bar({ a: 2 }) +
           baz([3]) + qux([4]) +
           combined(5, { a: 6 });
}
