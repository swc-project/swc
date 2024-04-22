//// [checkJsdocTypedefOnlySourceFile.ts]
//// [0.js]
// @ts-check
var exports = {};
/**
 * @typedef {string}
 */ exports.SomeName;
/** @type {exports.SomeName} */ var myString = 'str';
