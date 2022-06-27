// @module: amd
// @Filename: foo_0.ts
function foo() {
    return "test";
}
(function(foo) {
    var answer = foo.answer = 42;
})(foo || (foo = {}));
// @Filename: foo_1.ts
const foo = require("./foo_0");
if (foo.answer === 42) {
    var x = foo();
}
module.exports = foo;
export { };
