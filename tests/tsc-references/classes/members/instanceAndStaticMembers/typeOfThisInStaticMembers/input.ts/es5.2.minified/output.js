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
var C = function() {
    "use strict";
    function C(x) {
        _classCallCheck(this, C);
    }
    return _createClass(C, null, [
        {
            key: "bar",
            value: function() {
                return this;
            }
        }
    ]), C;
}(), t = C.bar();
t.foo + 1, t.bar(), new t(1);
var C2 = function() {
    "use strict";
    function C2(x) {
        _classCallCheck(this, C2);
    }
    return _createClass(C2, null, [
        {
            key: "bar",
            value: function() {
                return this;
            }
        }
    ]), C2;
}(), t2 = C2.bar();
t2.foo + 1, t2.bar(), new t2("");
