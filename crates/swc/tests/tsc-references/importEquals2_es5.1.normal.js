import * as swcHelpers from "@swc/helpers";
// @esModuleInterop: true
// @Filename: /a.ts
var A = function A() {
    "use strict";
    swcHelpers.classCallCheck(this, A);
};
module.exports = a;
// @Filename: /c.ts
var a = require("./b");
new a.A(); // Error
export { };
