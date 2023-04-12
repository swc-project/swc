//// [foo1.ts]
"use strict";
var _class_call_check = require("@swc/helpers/_/_class_call_check");
module.exports = function x() {
    "use strict";
    _class_call_check._(this, x);
};
//// [foo2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), require("@swc/helpers/_/_class_call_check"), require("@swc/helpers/_/_inherits"), require("@swc/helpers/_/_create_super"), require("./foo1");
