// Object spread of a primitive with no own enumerable properties contributes
// nothing and should be dropped entirely.
console.log({ a: 1, ...(void 0) });
console.log({ a: 1, ...void 0 });
console.log({ a: 1, ...null });
console.log({ a: 1, ...undefined });
console.log({ a: 1, ...true });
console.log({ a: 1, ...false });
console.log({ a: 1, ...42 });
console.log({ a: 1, ...(1 + 1) });
console.log({ ...(void 0), a: 1 });
console.log({ a: 1, ...(void 0), b: 2 });

// Strings expose indexed own enumerable properties, so they must NOT be dropped.
console.log({ a: 1, ..."ab" });

// A real object literal still flattens (existing behavior, must not regress).
console.log({ a: 1, ...{ b: 2 } });

// Array spread requires an iterable; spreading these primitives throws at
// runtime, so array spread must never be folded away.
console.log([1, ...[2, 3]]);
