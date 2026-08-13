// Folded: the result is never longer than the call it replaces.
console.log(3), console.log(4), console.log(-1), console.log(2), // Not folded: `1.4142135623730951` is longer than `Math.sqrt(2)`.
console.log(Math.sqrt(2)), // Folded: the outer call collapses even though the inner one would grow.
console.log(2), // Not folded: `1.7724538509055159` is exactly as long as the call, so folding
// it would only give the inliner a larger literal to duplicate.
console.log(Math.sqrt(Math.PI)), // Not folded: `1.6487212707001282` is one character longer than the call.
console.log(Math.sqrt(Math.E)), // Not folded: the argument is coerced by `cast_to_number`, so the call is
// foldable, but `1.4142135623730951` is longer than `Math.sqrt("2")`.
console.log(Math.sqrt("2")), // Folded: coerced the same way, but `1` and `0` are shorter than the call.
console.log(1), console.log(0), // Folded: a unary argument is measurable, and `NaN` is shorter than the call.
console.log(0 / 0);
