//// [foo1.ts]
var _class_call_check = require("@swc/helpers/_/_class_call_check");
module.exports = function x() {
    _class_call_check._(this, x);
};
//// [foo2.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), require("@swc/helpers/_/_call_super"), require("@swc/helpers/_/_class_call_check"), require("@swc/helpers/_/_inherits"), require("./foo1");
