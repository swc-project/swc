//// [checkJsdocSatisfiesTag1.ts]
//// [/a.js]
/**
 * @typedef {Object} T1
 * @property {number} a
 */ /**
 * @typedef {Object} T2
 * @property {"a" | "b"} a
 */ /**
 * @typedef {(x: string) => string} T3
 */ /**
 * @typedef {Object} T4
 * @property {string} a
 */ var t1 = /** @satisfies {T1} */ {
    a: 1
};
var t2 = /** @satisfies {T1} */ {
    a: 1,
    b: 1
};
var t3 = /** @satisfies {T1} */ {};
/** @type {T2} */ var t4 = /** @satisfies {T2} */ {
    a: "a"
};
/** @type {(m: string) => string} */ var t5 = /** @satisfies {T3} */ function(m) {
    return m.substring(0);
};
var t6 = /** @satisfies {[number, number]} */ [
    1,
    2
];
var t7 = /** @satisfies {T4} */ {
    a: 'test'
};
var t8 = /** @satisfies {T4} */ {
    a: 'test',
    b: 'test'
};
