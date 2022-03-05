import * as swcHelpers from "@swc/helpers";
var _method = new WeakSet();
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
