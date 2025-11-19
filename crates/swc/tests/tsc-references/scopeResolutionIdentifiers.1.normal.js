//// [scopeResolutionIdentifiers.ts]
// EveryType used in a nested scope of a different EveryType with the same name, type of the identifier is the one defined in the inner scope
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var s;
(function(M1) {
    var n = M1.s;
    var n;
})(M1 || (M1 = {}));
(function(M2) {
    var s;
    var n = s;
    var n;
})(M2 || (M2 = {}));
function fn() {
    var s;
    var n = s;
    var n;
}
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
        this.n = this.s;
    }
    var _proto = C.prototype;
    _proto.x = function x() {
        var p = this.n;
        var p;
    };
    return C;
}();
(function(M3) {
    var s;
    (function(M4) {
        var n = s;
        var n;
    })(M4 || (M4 = {}));
    var M4;
})(M3 || (M3 = {}));
var M1, M2, M3;
