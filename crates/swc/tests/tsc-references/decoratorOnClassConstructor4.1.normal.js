//// [decoratorOnClassConstructor4.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _call_super = require("@swc/helpers/_/_call_super");
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _inherits = require("@swc/helpers/_/_inherits");
var _ts_decorate = require("@swc/helpers/_/_ts_decorate");
var _ts_metadata = require("@swc/helpers/_/_ts_metadata");
var A = function A() {
    "use strict";
    _class_call_check._(this, A);
};
A = _ts_decorate._([
    dec
], A);
var B = function B(x) {
    "use strict";
    _class_call_check._(this, B);
};
B = _ts_decorate._([
    dec,
    _ts_metadata._("design:type", Function),
    _ts_metadata._("design:paramtypes", [
        Number
    ])
], B);
var C = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits._(C, A);
    function C() {
        _class_call_check._(this, C);
        return _call_super._(this, C, arguments);
    }
    return C;
}(A);
C = _ts_decorate._([
    dec
], C);
