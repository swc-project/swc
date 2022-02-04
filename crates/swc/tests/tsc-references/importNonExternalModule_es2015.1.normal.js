// @module: amd
// @Filename: foo_0.ts
var foo;
(function(foo1) {
    var answer = foo1.answer = 42;
})(foo || (foo = {}));
// @Filename: foo_1.ts
const foo = require("./foo_0");
// Import should fail.  foo_0 not an external module
if (foo.answer === 42) {}
export { };
