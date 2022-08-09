// @module: amd
// @Filename: foo_0.ts
function foo() {
    return "test";
}
(function(foo) {
    var answer = foo.answer = 42;
})(foo || (foo = {}));
module.exports = foo;
export { };
// @Filename: foo_1.ts
var foo = require("./foo_0");
if (foo.answer === 42) {
    var x = foo();
}
export { };
