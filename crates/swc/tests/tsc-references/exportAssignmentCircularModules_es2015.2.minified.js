var Foo;
const foo1 = require('./foo_1');
(Foo || (Foo = {})).x = foo1.x, module.exports = Foo;
const foo2 = require("./foo_2");
(Foo || (Foo = {})).x = foo2.x, module.exports = Foo;
const foo0 = require("./foo_0");
(Foo || (Foo = {})).x = foo0.x, module.exports = Foo;
export { };
