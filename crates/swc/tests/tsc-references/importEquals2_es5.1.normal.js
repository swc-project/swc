import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @esModuleInterop: true
// @Filename: /a.ts
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
module.exports = a;
// @Filename: /c.ts
var a = require("./b");
new a.A(); // Error
export { };
