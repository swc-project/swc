import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// EveryType used in a nested scope of a different EveryType with the same name, type of the identifier is the one defined in the inner scope
var s;
var M1;
(function(M1) {
    var s;
    var n = s;
    var n;
    M1.s = s;
})(M1 || (M1 = {}));
var M2;
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
var M3;
(function(M3) {
    var s;
    var M4;
    (function(M4) {
        var n = s;
        var n;
    })(M4 || (M4 = {}));
})(M3 || (M3 = {}));
