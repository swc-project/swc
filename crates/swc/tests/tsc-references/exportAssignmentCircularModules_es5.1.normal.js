// @module: amd
// @Filename: foo_0.ts
var foo1 = require("./foo_1");
var Foo;
(function(Foo) {
    var x = Foo.x = foo1.x;
})(Foo || (Foo = {}));
module.exports = Foo;
// @Filename: foo_1.ts
var foo2 = require("./foo_2");
(function(Foo) {
    var x = Foo.x = foo2.x;
})(Foo || (Foo = {}));
module.exports = Foo;
// @Filename: foo_2.ts
var foo0 = require("./foo_0");
(function(Foo) {
    var x = Foo.x = foo0.x;
})(Foo || (Foo = {}));
module.exports = Foo;
export { };
