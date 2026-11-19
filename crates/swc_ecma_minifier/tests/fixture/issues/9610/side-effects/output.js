// Test: Default values with side effects should NOT be removed
// The function call in default value has side effects
let sideEffectCounter = 0;
function getSideEffect() {
    return sideEffectCounter++, "value";
}
// This should NOT have the default param removed because getSideEffect() has side effects
function foo(a, b = getSideEffect()) {
    return a;
}
// This SHOULD have the default param removed because literal has no side effects
function bar(a) {
    return a;
}
// This should NOT have the default param removed because new Date() has side effects
function baz(a, b = new Date()) {
    return a;
}
export function example() {
    return foo(1) + bar(2) + baz(3);
}
