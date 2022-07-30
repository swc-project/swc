// @module: amd
// @Filename: foo_0.ts
var foo;
(function(foo) {
    foo[foo["red"] = 0] = "red";
    foo[foo["green"] = 1] = "green";
    foo[foo["blue"] = 2] = "blue";
})(foo || (foo = {}));
(function(foo) {
    var answer = foo.answer = 42;
})(foo || (foo = {}));
module.exports = foo;
export { };
// @Filename: foo_1.ts
var foo = require("./foo_0");
var color;
if (color === foo.green) {
    color = foo.answer;
}
export { };
