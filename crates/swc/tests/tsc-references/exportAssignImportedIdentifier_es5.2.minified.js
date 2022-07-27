export function x() {
    return !0;
}
var x = require("./foo1").x;
module.exports = x;
export { };
require("./foo2")();
export { };
