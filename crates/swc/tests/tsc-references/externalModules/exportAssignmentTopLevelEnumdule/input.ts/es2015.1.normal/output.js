var // @module: amd
// @Filename: foo_0.ts
foo;
(function(foo1) {
    foo1[foo1["red"] = 0] = "red";
    foo1[foo1["green"] = 1] = "green";
    foo1[foo1["blue"] = 2] = "blue";
})(foo || (foo = {
}));
(function(foo2) {
    foo2.answer = 42;
})(foo || (foo = {
}));
module.exports = foo;
// @Filename: foo_1.ts
const foo = require("./foo_0");
var color;
if (color === foo.green) {
    color = foo.answer;
}
export { };
