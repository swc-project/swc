export function x() {
    return !0;
}
const foo1 = require("./foo1");
module.exports = foo1.x // Ok
;
