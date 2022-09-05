//// [neverType.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function error(message) {
    throw Error(message);
}
!function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    return _proto.void1 = function() {
        throw Error();
    }, _proto.void2 = function() {
        for(;;);
    }, _proto.never1 = function() {
        throw Error();
    }, _proto.never2 = function() {
        for(;;);
    }, C;
}(), error("Something failed"), function() {
    throw Error();
}(), error("Error callback");
