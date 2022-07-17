// @module: node12,nodenext
// @allowJs: true
// @noEmit: true
// @filename: foo.cjs
// @filename: bar.ts
import foo from "./foo.cjs";
exports.foo = "foo";
foo.foo;
