// @module: amd
// @Filename: foo_0.ts
var Foo;
(function(Foo1) {
    var answer = Foo1.answer = 42;
})(Foo || (Foo = {}));
module.exports = Foo;
// @Filename: foo_1.ts
var foo = require("./foo_0");
if (foo.answer === 42) {}
export { };
