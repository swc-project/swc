// @Filename: foo1.ts
export function x() {
    return true;
}
// @Filename: foo2.ts
var foo1 = require("./foo1");
module.exports = foo1.x;
