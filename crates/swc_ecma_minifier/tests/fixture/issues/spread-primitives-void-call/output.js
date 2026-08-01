// The motivating case: a pure call inside `void` is reduced to `void 0` by
// earlier passes, and the resulting trivial spread is then dropped.
console.log({
    a: 1
});
