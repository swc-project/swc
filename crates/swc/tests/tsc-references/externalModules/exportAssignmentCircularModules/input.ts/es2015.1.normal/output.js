// @module: amd
// @Filename: foo_0.ts
const foo1 = require('./foo_1');
let Foo;
(function(Foo) {
    Foo.x = foo1.x;
})(Foo || (Foo = {
}));
module.exports = Foo;
// @Filename: foo_1.ts
const foo2 = require("./foo_2");
(function(Foo) {
    Foo.x = foo2.x;
})(Foo || (Foo = {
}));
module.exports = Foo;
// @Filename: foo_2.ts
const foo0 = require("./foo_0");
(function(Foo) {
    Foo.x = foo0.x;
})(Foo || (Foo = {
}));
module.exports = Foo;
export { };
