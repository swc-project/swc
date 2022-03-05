export function x() {
    return !0;
}
var x = require("./foo1").x;
module.exports = x;
var x = require("./foo2")();
