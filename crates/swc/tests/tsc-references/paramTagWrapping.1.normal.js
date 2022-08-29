//// [paramTagWrapping.ts]
//// [good.js]
/**
 * @param
 * {number} x Arg x.
 * @param {number}
 * y Arg y.
 * @param {number} z
 * Arg z.
 */ function good(x, y, z) {}
good(1, 2, 3);
//// [bad.js]
/**
 * @param *
 * {number} x Arg x.
 * @param {number}
 * * y Arg y.
 * @param {number} * z
 * Arg z.
 */ function bad(x, y, z) {}
bad(1, 2, 3);
