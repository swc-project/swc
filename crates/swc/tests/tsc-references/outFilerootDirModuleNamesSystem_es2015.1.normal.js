// @target: ES6
// @module: system
// @rootDir: tests/cases/conformance/es6/moduleExportsSystem/src
// @outFile: output.js
// @filename: src/a.ts
import foo from "./b";
// @filename: src/b.ts
import Foo from "./a";
export default class Foo {
};
foo();
export default function foo() {
    new Foo();
};
// https://github.com/microsoft/TypeScript/issues/37429
import("./a");
