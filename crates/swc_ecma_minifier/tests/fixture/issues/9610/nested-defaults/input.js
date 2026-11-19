// Test: Nested default patterns

// Nested object destructuring with default
function foo({ outer: { inner = 10 } }) {
    return inner;
}

// Nested object with default for entire nested part
function bar({ outer = { inner: 20 } }) {
    return outer.inner;
}

// Default with another default inside object
function baz({ a = { b: 30 } }) {
    return a.b;
}

// Array inside object with default
function qux({ arr: [first, second = 40] }) {
    return first;
}

export function example() {
    return foo({ outer: { inner: 1 } }) +
           bar({}) +
           baz({}) +
           qux({ arr: [5] });
}
