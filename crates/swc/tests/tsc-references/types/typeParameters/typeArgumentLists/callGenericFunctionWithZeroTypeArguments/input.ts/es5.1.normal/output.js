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
// valid invocations of generic functions with no explicit type arguments provided 
function f(x) {
    return null;
}
var r = f(1);
var f2 = function(x) {
    return null;
};
var r2 = f2(1);
var f3;
var r3 = f3(1);
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
    }
    _createClass(C, [
        {
            key: "f",
            value: function f(x) {
                return null;
            }
        }
    ]);
    return C;
}();
var r4 = new C().f(1);
var i1;
var r5 = i1.f(1);
var C2 = /*#__PURE__*/ function() {
    "use strict";
    function C2() {
        _classCallCheck(this, C2);
    }
    _createClass(C2, [
        {
            key: "f",
            value: function f(x) {
                return null;
            }
        }
    ]);
    return C2;
}();
var r6 = new C2().f(1);
var i2;
var r7 = i2.f(1);
