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
var C1 = function() {
    "use strict";
    function C1() {
        _classCallCheck(this, C1);
    }
    return _createClass(C1, [
        {
            key: "bar",
            value: function() {}
        }
    ]), C1;
}(), C2 = function() {
    "use strict";
    function C2() {
        _classCallCheck(this, C2);
    }
    return _createClass(C2, null, [
        {
            key: "bar",
            value: function() {}
        }
    ]), C2;
}(), C3 = function() {
    "use strict";
    _classCallCheck(this, C3);
};
C3.bar = "test";
