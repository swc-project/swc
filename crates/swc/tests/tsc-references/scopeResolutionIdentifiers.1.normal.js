//// [scopeResolutionIdentifiers.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
// EveryType used in a nested scope of a different EveryType with the same name, type of the identifier is the one defined in the inner scope
var s1;
(function(_$M1) {
    var n = s;
    var n;
})(_$M1 || (_$M1 = {}));
(function(_$M2) {
    var s1;
    var n = s1;
    var n;
})(_$M2 || (_$M2 = {}));
function fn() {
    var s1;
    var n = s1;
    var n;
    var _$M1, _$M2;
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
    var s1;
    (function(M4) {
        var n = s1;
        var n;
    })(M4 || (M4 = {}));
    var M4;
})(M3 || (M3 = {}));
var M3;
