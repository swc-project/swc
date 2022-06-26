// @module: commonjs
// @Filename: foo_0.ts
export var foo = 42;
// @Filename: test/test/foo_1.ts
export function f() {
    return 42;
}
// @Filename: test/foo_2.ts
export var M2;
(function(M2) {
    var x = M2.x = true;
})(M2 || (M2 = {}));
// @Filename: test/foo_3.ts
var foo0 = require("../foo_0");
var foo1 = require("./test/foo_1");
var foo2 = require("./.././test/foo_2");
if (foo2.M2.x) {
    var x = foo0.foo + foo1.f();
}
