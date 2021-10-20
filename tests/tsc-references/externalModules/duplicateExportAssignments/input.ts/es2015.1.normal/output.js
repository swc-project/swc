// @Filename: foo1.ts
var x1 = 10;
var y = 20;
module.exports = x1;
module.exports = y;
// @Filename: foo2.ts
var x1 = 10;
class y {
}
module.exports = x1;
module.exports = y;
(function(x) {
    x.x = 10;
})(x1 || (x1 = {
}));
class y {
}
module.exports = x1;
module.exports = y;
// @Filename: foo4.ts
module.exports = x1;
function x1() {
    return 42;
}
function y() {
    return 42;
}
module.exports = y;
// @Filename: foo5.ts
var x1 = 5;
var y = "test";
var z = {
};
module.exports = x1;
module.exports = y;
module.exports = z;
export { };
