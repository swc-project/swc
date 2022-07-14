export var foo = 42;
export function f() {
    return 42;
}
export var M2;
(M2 || (M2 = {})).x = !0;
var foo0 = require("../foo_0"), foo1 = require("./test/foo_1"), foo2 = require("./.././test/foo_2");
foo2.M2.x && (foo0.foo, foo1.f());
