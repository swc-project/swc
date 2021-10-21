function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Constructor;
}
function f(x, y) {
    return null;
}
f(1, ""), f(1, "");
var f3, i1, i2, f2 = function(x, y) {
    return null;
};
f2(1, ""), f2(1, ""), f3(1, ""), f3(1, "");
var C = function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
    }
    return _createClass(C, [
        {
            key: "f",
            value: function(x, y) {
                return null;
            }
        }
    ]), C;
}();
new C().f(1, ""), new C().f(1, ""), i1.f(1, ""), i1.f(1, "");
var C2 = function() {
    "use strict";
    function C2() {
        _classCallCheck(this, C2);
    }
    return _createClass(C2, [
        {
            key: "f",
            value: function(x, y) {
                return null;
            }
        }
    ]), C2;
}();
new C2().f(1, ""), new C2().f(1, ""), i2.f(1, ""), i2.f(1, "");
