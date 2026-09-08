// The motivating case: a pure call inside `void` is reduced to `void 0` by
// earlier passes, and the resulting trivial spread is then dropped.
function foo() {
    return 1 + 1;
}
console.log({ a: 1, ...(void foo()) });
