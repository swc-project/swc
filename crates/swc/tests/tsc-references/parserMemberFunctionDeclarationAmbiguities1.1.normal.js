//// [parserMemberFunctionDeclarationAmbiguities1.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.public = function _public() {};
    _proto.static = function _static() {};
    C.public = function _public() {};
    C.static = function _static() {};
    return C;
}();
