// @module: amd
// @Filename: foo_0.ts
function foo() {
    return "test";
}
(function(foo1) {
    foo1.answer = 42;
})(foo || (foo = {
}));
module.exports = foo;
// @Filename: foo_1.ts
const foo = require("./foo_0");
if (foo.answer === 42) {
    var x = foo();
}
export { };
