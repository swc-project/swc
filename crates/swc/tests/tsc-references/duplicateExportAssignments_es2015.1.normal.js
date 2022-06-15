// @Filename: foo1.ts
var x = 10;
var y = 20;
module.exports = x;
module.exports = y;
// @Filename: foo2.ts
var x = 10;
class y {
}
module.exports = x;
module.exports = y;
(function(x) {
    var x1 = x.x = 10;
})(x || (x = {}));
class y {
}
module.exports = x;
module.exports = y;
// @Filename: foo4.ts
module.exports = x;
function x() {
    return 42;
}
function y() {
    return 42;
}
module.exports = y;
// @Filename: foo5.ts
var x = 5;
var y = "test";
var z = {};
module.exports = x;
module.exports = y;
module.exports = z;
export { };
