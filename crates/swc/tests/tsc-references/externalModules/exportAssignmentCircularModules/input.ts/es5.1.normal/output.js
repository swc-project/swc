// @module: amd
// @Filename: foo_0.ts
var foo1 = require('./foo_1');
var Foo1;
(function(Foo) {
    Foo.x = foo1.x;
})(Foo1 || (Foo1 = {
}));
module.exports = Foo1;
// @Filename: foo_1.ts
var foo2 = require("./foo_2");
(function(Foo) {
    Foo.x = foo2.x;
})(Foo1 || (Foo1 = {
}));
module.exports = Foo1;
// @Filename: foo_2.ts
var foo0 = require("./foo_0");
(function(Foo) {
    Foo.x = foo0.x;
})(Foo1 || (Foo1 = {
}));
module.exports = Foo1;
export { };
