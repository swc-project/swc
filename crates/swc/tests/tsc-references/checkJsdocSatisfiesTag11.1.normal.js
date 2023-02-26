//// [checkJsdocSatisfiesTag11.ts]
//// [/a.js]
/**
 * @typedef {Object} T1
 * @property {number} a
 */ /**
 * @typedef {Object} T2
 * @property {number} a
 */ /**
 * @satisfies {T1}
 * @satisfies {T2}
 */ var t1 = {
    a: 1
};
/**
 * @satisfies {number}
 */ var t2 = /** @satisfies {number} */ 1;
