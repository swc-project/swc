function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
// EveryType used in a nested scope of a different EveryType with the same name, type of the identifier is the one defined in the inner scope
var s;
var M1;
(function(M11) {
    var s1;
    var n = s1;
    var n;
    M11.s = s1;
})(M1 || (M1 = {
}));
var M2;
(function(M2) {
    var s2;
    var n = s2;
    var n;
})(M2 || (M2 = {
}));
function fn() {
    var s3;
    var n = s3;
    var n;
}
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
        this.n = this.s;
    }
    _createClass(C, [
        {
            key: "x",
            value: function x() {
                var p = this.n;
                var p;
            }
        }
    ]);
    return C;
}();
var M3;
(function(M3) {
    var s4;
    var M4;
    (function(M4) {
        var n = s4;
        var n;
    })(M4 || (M4 = {
    }));
})(M3 || (M3 = {
}));
