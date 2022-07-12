// @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: tests/cases/conformance/jsdoc/declarations/out
// @declaration: true
// @filename: node_modules/@types/node/index.d.ts
// @filename: index.js
/// <reference types="node" />
const Something = require("fs").Something;
const thing = new Something();
module.exports = {
    thing
};
