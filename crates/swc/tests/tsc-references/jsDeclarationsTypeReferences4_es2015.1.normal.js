// @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: tests/cases/conformance/jsdoc/declarations/out
// @declaration: true
// @filename: node_modules/@types/node/index.d.ts
// @filename: index.js
/// <reference types="node" />
export const Something = 2; // to show conflict that can occur
// @ts-ignore
export var A;
(function(A) {
    let B;
    (function(B) {
        const Something = require("fs").Something;
        const thing = new Something();
    })(B = A.B || (A.B = {}));
})(A || (A = {}));
