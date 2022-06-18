var // @module: amd
// @Filename: foo_0.ts
foo;
(function(foo) {
    foo[foo["red"] = 0] = "red";
    foo[foo["green"] = 1] = "green";
    foo[foo["blue"] = 2] = "blue";
})(foo || (foo = {}));
(function(foo) {
    var answer = foo.answer = 42;
})(foo || (foo = {}));
// @Filename: foo_1.ts
const foo = require("./foo_0");
var color;
if (color === foo.green) {
    color = foo.answer;
}
module.exports = foo;
export { };
