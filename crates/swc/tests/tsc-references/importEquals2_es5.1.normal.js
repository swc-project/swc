import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @Filename: /b.ts
import * as a from "./a";
// @esModuleInterop: true
// @Filename: /a.ts
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
// @Filename: /c.ts
var a = require("./b");
new a.A(); // Error
module.exports = a;
