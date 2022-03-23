// @module: amd
// @Filename: foo_0.ts
var foo1 = require("./foo_1");
var Foo;
(function(Foo1) {
    var x = Foo1.x = foo1.x;
})(Foo || (Foo = {}));
module.exports = Foo;
// @Filename: foo_1.ts
var foo2 = require("./foo_2");
(function(Foo2) {
    var x = Foo2.x = foo2.x;
})(Foo || (Foo = {}));
module.exports = Foo;
// @Filename: foo_2.ts
var foo0 = require("./foo_0");
(function(Foo3) {
    var x = Foo3.x = foo0.x;
})(Foo || (Foo = {}));
module.exports = Foo;
export { };
