export function x() {
    return !0;
}
const foo1 = require("./foo1");
var x = foo1.x;
module.exports = x;
const foo2 = require("./foo2");
var x = foo2(); // should be boolean
