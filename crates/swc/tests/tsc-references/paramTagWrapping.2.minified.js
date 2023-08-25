//// [paramTagWrapping.ts]
//// [good.js]
/**
 * @param
 * {number} x Arg x.
 * @param {number}
 * y Arg y.
 * @param {number} z
 * Arg z.
 */ //// [bad.js]
/**
 * @param *
 * {number} x Arg x.
 * @param {number}
 * * y Arg y.
 * @param {number} * z
 * Arg z.
 */ 
