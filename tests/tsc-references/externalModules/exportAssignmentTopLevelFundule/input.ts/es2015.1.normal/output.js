// @module: amd
// @Filename: foo_0.ts
function foo1() {
    return "test";
}
(function(foo) {
    foo.answer = 42;
})(foo1 || (foo1 = {
}));
module.exports = foo1;
// @Filename: foo_1.ts
const foo1 = require("./foo_0");
if (foo1.answer === 42) {
    var x = foo1();
}
export { };
