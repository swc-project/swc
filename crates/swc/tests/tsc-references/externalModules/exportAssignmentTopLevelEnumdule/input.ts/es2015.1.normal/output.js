let // @module: amd
// @Filename: foo_0.ts
foo;
(function(foo) {
    foo[foo["red"] = 0] = "red";
    foo[foo["green"] = 1] = "green";
    foo[foo["blue"] = 2] = "blue";
})(foo || (foo = {
}));
(function(foo) {
    foo.answer = 42;
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
