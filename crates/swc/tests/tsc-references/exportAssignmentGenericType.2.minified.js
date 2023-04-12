//// [foo_0.ts]
"use strict";
var _class_call_check = require("@swc/helpers/_/_class_call_check");
module.exports = function Foo() {
    "use strict";
    _class_call_check._(this, Foo);
};
//// [foo_1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), new (require("./foo_0"))().test;
