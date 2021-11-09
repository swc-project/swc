// @module: commonjs
// @Filename: vs/foo_0.ts
export var x;
// @Filename: foo_1.ts
var foo = require("./vs/foo_0");
var fum = require("./vs/fum");
var z = foo.x + fum.y;
