//// [decoratorOnClassConstructor4.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _call_super = require("@swc/helpers/_/_call_super"), _class_call_check = require("@swc/helpers/_/_class_call_check"), _inherits = require("@swc/helpers/_/_inherits"), _ts_decorate = require("@swc/helpers/_/_ts_decorate"), _ts_metadata = require("@swc/helpers/_/_ts_metadata"), A = function A() {
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
    function C() {
        return _class_call_check._(this, C), _call_super._(this, C, arguments);
    }
    return _inherits._(C, A), C;
}(A);
_ts_decorate._([
    dec
], C);
