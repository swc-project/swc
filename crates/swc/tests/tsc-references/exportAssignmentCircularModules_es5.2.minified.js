var Foo, foo1 = require("./foo_1");
(Foo || (Foo = {})).x = foo1.x;
var foo2 = require("./foo_2");
(Foo || (Foo = {})).x = foo2.x;
var foo0 = require("./foo_0");
(Foo || (Foo = {})).x = foo0.x, module.exports = Foo;
export { };
