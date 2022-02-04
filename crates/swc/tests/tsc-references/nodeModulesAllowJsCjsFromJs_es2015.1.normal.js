// @filename: bar.ts
import foo from "./foo.cjs";
// @module: node12,nodenext
// @allowJs: true
// @noEmit: true
// @filename: foo.cjs
exports.foo = "foo";
foo.foo;
