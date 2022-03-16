import * as swcHelpers from "@swc/helpers";
var _method = /*#__PURE__*/ new WeakSet();
// @strict: true
// @target: es6
var A1 = function A1(name) {
    "use strict";
    swcHelpers.classCallCheck(this, A1);
    swcHelpers.classPrivateMethodInit(this, _method);
    swcHelpers.classPrivateMethodGet(this, _method, method).call(this, "");
    swcHelpers.classPrivateMethodGet(this, _method, method).call(this, 1) // Error
    ;
    swcHelpers.classPrivateMethodGet(this, _method, method).call(this) // Error 
    ;
};
function method(param) {
    return "";
}
