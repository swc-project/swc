//// [checkJsdocSatisfiesTag10.ts]
//// [/a.js]
/** @typedef {"a" | "b" | "c" | "d"} Keys */ var p = /** @satisfies {Partial<Record<Keys, unknown>>} */ {
    a: 0,
    b: "hello",
    x: 8 // Should error, 'x' isn't in 'Keys'
};
// Should be OK -- retain info that a is number and b is string
var a = p.a.toFixed();
var b = p.b.substring(1);
// Should error even though 'd' is in 'Keys'
var d = p.d;
