//// [/some-mod.d.ts]
export { };
//// [index.js]
/** @type {typeof import("/some-mod")} */ var items = [];
module.exports = items;
