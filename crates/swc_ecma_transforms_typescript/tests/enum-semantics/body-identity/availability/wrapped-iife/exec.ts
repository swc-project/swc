function asArrow() {
    ((<T>() => { enum E { A = later } return E.A; }) as any)();
    const later = 1;
}
function asFunction() {
    ((function<T>() { enum E { A = later } return E.A; }) as any)();
    const later = 1;
}
function satisfiesArrow() {
    ((<T>() => { enum E { A = later } return E.A; }) satisfies Function)();
    const later = 1;
}
function nonNullFunction() {
    ((function<T>() { enum E { A = later } return E.A; })!)();
    const later = 1;
}
function assertionArrow() {
    (<any>(<T>() => { enum E { A = later } return E.A; }))();
    const later = 1;
}
function instantiationFunction() {
    ((function<T>() { enum E { A = later } return E.A; })<number>)();
    const later = 1;
}
function parenthesizedArrow() {
    (((() => { enum E { A = later } return E.A; })))();
    const later = 1;
}
function parenthesizedFunction() {
    (((function() { enum E { A = later } return E.A; })))();
    const later = 1;
}
function wrappedLocalArrow() {
    ((() => { enum E { A = later } const later = 1; return E.A; }) as any)();
}
// Type wrappers keep TypeScript's deferred-function analysis boundary.
expect(asArrow).not.toThrow();
expect(asFunction).not.toThrow();
expect(satisfiesArrow).not.toThrow();
expect(nonNullFunction).not.toThrow();
expect(assertionArrow).not.toThrow();
expect(instantiationFunction).not.toThrow();
// Grouping alone preserves direct invocation, and local declarations still
// obey declaration order within a deferred function.
expect(parenthesizedArrow).toThrow(ReferenceError);
expect(parenthesizedFunction).toThrow(ReferenceError);
expect(wrappedLocalArrow).toThrow(ReferenceError);
