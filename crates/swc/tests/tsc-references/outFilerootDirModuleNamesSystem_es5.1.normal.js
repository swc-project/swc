// @target: ES6
// @module: system
// @rootDir: tests/cases/conformance/es6/moduleExportsSystem/src
// @outFile: output.js
// @filename: src/a.ts
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import foo from "./b";
// @filename: src/b.ts
import Foo from "./a";
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
};
export { Foo as default };
foo();
export default function foo() {
    new Foo();
};
// https://github.com/microsoft/TypeScript/issues/37429
import("./a");
