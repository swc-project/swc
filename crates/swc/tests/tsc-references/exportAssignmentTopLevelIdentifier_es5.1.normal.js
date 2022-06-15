// @module: amd
// @Filename: foo_0.ts
var Foo;
(function(Foo) {
    var answer = Foo.answer = 42;
})(Foo || (Foo = {}));
module.exports = Foo;
// @Filename: foo_1.ts
var foo = require("./foo_0");
if (foo.answer === 42) {}
export { };
