//// [checkJsdocTypeTag4.ts]
//// [t.d.ts]
//// [test.js]
/** Also should error for jsdoc typedefs
 * @template {string} U
 * @typedef {{ b: U }} B
 */ /** @type {A<number>} */ var a;
/** @type {B<number>} */ var b;
