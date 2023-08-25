//// [checkJsdocSatisfiesTag4.ts]
//// [/a.js]
/**
 * @typedef {Object} Foo
 * @property {number} a
 */ export default /** @satisfies {Foo} */ {};
//// [/b.js]
/**
 * @typedef {Object} Foo
 * @property {number} a
 */ export default /** @satisfies {Foo} */ {
    a: 1
};
