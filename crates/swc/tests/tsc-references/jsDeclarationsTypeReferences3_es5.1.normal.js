// @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: tests/cases/conformance/jsdoc/declarations/out
// @declaration: true
// @filename: node_modules/@types/node/index.d.ts
// @filename: index.js
/// <reference types="node" />
var Something = require("fs").Something;
module.exports.A = {};
module.exports.A.B = {
    thing: new Something()
};
