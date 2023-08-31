//// [checkJsdocSatisfiesTag12.ts]
//// [/a.js]
/**
 * @typedef {Object} T1
 * @property {number} a
 */ /**
 * @typedef {Object} T2
 * @property {string} a
 */ /**
 * @typedef {Object} T3
 * @property {"a" | "b"} a
 */ /**
 * @satisfies {T1}
 */ 
