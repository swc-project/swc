// @target: ES6
// @module: system
// @rootDir: tests/cases/conformance/es6/moduleExportsSystem/src
// @outFile: output.js
// @filename: src/a.ts
import foo from "./b";
export default class Foo {}
foo();

// @filename: src/b.ts
import Foo from "./a";
export default function foo() { new Foo(); }
