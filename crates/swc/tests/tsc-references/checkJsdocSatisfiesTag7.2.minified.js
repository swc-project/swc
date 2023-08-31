//// [checkJsdocSatisfiesTag7.ts]
//// [/a.js]
/** @typedef {"a" | "b" | "c" | "d"} Keys */ var p = /** @satisfies {Record<Keys, unknown>} */ {
    a: 0,
    b: "hello"
};
p.a.toFixed(), p.b.substring(1), p.d;
