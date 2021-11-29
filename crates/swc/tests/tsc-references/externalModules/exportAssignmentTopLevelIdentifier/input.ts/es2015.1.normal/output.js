// @module: amd
// @Filename: foo_0.ts
let Foo;
(function(Foo) {
    Foo.answer = 42;
})(Foo || (Foo = {
}));
module.exports = Foo;
// @Filename: foo_1.ts
const foo = require("./foo_0");
if (foo.answer === 42) {
}
export { };
