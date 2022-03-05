import * as swcHelpers from "@swc/helpers";
var A = function A() {
    "use strict";
    swcHelpers.classCallCheck(this, A);
};
module.exports = a;
// @Filename: /c.ts
var a = require('./b');
new a.A(); // Error
// @esModuleInterop: true
// @Filename: /a.ts
export { };
