// @Filename: test.js
/** @type {A<number>} */ /** Also should error for jsdoc typedefs
 * @template {string} U
 * @typedef {{ b: U }} B
 */ /** @type {A<number>} */ var a;
/** @type {B<number>} */ var b;
