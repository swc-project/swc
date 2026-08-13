// Folded: the result is never longer than the call it replaces.
console.log(Math.floor(3.7));
console.log(Math.ceil(3.2));
console.log(Math.round(-1.5));
console.log(Math.sqrt(4));

// Not folded: `1.4142135623730951` is longer than `Math.sqrt(2)`.
console.log(Math.sqrt(2));

// Folded: the outer call collapses even though the inner one would grow.
console.log(Math.ceil(Math.sqrt(2)));

// Not folded: `1.7724538509055159` is exactly as long as the call, so folding
// it would only give the inliner a larger literal to duplicate.
console.log(Math.sqrt(Math.PI));

// Not folded: `1.6487212707001282` is one character longer than the call.
console.log(Math.sqrt(Math.E));
