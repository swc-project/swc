var // @module: amd
// @Filename: foo_0.ts
foo1;
(function(foo) {
    foo[foo["red"] = 0] = "red";
    foo[foo["green"] = 1] = "green";
    foo[foo["blue"] = 2] = "blue";
})(foo1 || (foo1 = {
}));
(function(foo) {
    foo.answer = 42;
})(foo1 || (foo1 = {
}));
module.exports = foo1;
// @Filename: foo_1.ts
var foo1 = require("./foo_0");
var color;
if (color === foo1.green) {
    color = foo1.answer;
}
export { };
