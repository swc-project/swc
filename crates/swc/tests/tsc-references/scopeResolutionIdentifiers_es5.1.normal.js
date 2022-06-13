import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// EveryType used in a nested scope of a different EveryType with the same name, type of the identifier is the one defined in the inner scope
var s;
var M1;
(function(M11) {
    var s1;
    var n = s1;
    var n;
    M11.s = s1;
})(M1 || (M1 = {}));
var M2;
(function(M2) {
    var s2;
    var n = s2;
    var n;
})(M2 || (M2 = {}));
function fn() {
    var s3;
    var n = s3;
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
    var s4;
    var M4;
    (function(M4) {
        var n = s4;
        var n;
    })(M4 || (M4 = {}));
})(M3 || (M3 = {}));
