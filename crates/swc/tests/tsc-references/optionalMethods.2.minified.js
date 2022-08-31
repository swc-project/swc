//// [optionalMethods.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function() {
    "use strict";
    function Bar(d) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 10;
        _class_call_check(this, Bar), this.d = d, this.e = e, this.c = 2;
    }
    var _proto = Bar.prototype;
    return _proto.f = function() {
        return 1;
    }, _proto.h = function() {
        return 2;
    }, Bar;
}();
