// @target: ES6
// @module: amd
// @rootDir: tests/cases/conformance/es6/moduleExportsAmd/src
// @outFile: output.js
// @filename: src/a.ts
import foo from "./b";
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var Foo = function Foo() {
    "use strict";
    _classCallCheck(this, Foo);
};
export { Foo as default };
foo();
export default function foo() {
    new Foo();
};
// https://github.com/microsoft/TypeScript/issues/37429
import("./a");
