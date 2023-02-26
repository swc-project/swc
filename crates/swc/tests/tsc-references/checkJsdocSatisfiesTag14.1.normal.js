//// [checkJsdocSatisfiesTag14.ts]
//// [/a.js]
/**
 * @typedef {Object} T1
 * @property {number} a
 */ /**
 * @satisfies T1
 */ var t1 = {
    a: 1
};
var t2 = /** @satisfies T1 */ {
    a: 1
};
