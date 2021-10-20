// @module: amd
// @Filename: foo_0.ts
var foo1;
(function(foo) {
    foo.answer = 42;
})(foo1 || (foo1 = {
}));
// @Filename: foo_1.ts
const foo1 = require("./foo_0");
// Import should fail.  foo_0 not an external module
if (foo1.answer === 42) {
}
export { };
