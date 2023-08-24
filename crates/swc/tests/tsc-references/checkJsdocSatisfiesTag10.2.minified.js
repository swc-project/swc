//// [checkJsdocSatisfiesTag10.ts]
//// [/a.js]
/** @typedef {"a" | "b" | "c" | "d"} Keys */ var p = /** @satisfies {Partial<Record<Keys, unknown>>} */ {
    a: 0,
    b: "hello"
};
p.a.toFixed(), p.b.substring(1), p.d;
