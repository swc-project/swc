//// [a.js]
/**
 * @template {{ a: number, b: string }} T,U A Comment
 * @template {{ c: boolean }} V uh ... are comments even supported??
 * @template W
 * @template X That last one had no comment
 * @typedef {{ t: T, u: U, v: V, w: W, x: X }} Everything
 */ /** @type {Everything<{ a: number, b: 'hi', c: never }, undefined, { c: true, d: 1 }, number, string>} */ //// [test.ts]
