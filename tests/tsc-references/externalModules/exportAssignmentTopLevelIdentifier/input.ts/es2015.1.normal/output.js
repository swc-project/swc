// @module: amd
// @Filename: foo_0.ts
var Foo1;
(function(Foo) {
    Foo.answer = 42;
})(Foo1 || (Foo1 = {
}));
module.exports = Foo1;
// @Filename: foo_1.ts
const foo = require("./foo_0");
if (foo.answer === 42) {
}
export { };
