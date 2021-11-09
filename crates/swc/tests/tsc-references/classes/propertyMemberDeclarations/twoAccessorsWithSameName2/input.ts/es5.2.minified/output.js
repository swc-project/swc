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
    function C() {
        _classCallCheck(this, C);
    }
    return _createClass(C, null, [
        {
            key: "x",
            get: function() {
                return 1;
            }
        }
    ]), C;
}(), D = function() {
    "use strict";
    function D() {
        _classCallCheck(this, D);
    }
    return _createClass(D, null, [
        {
            key: "x",
            set: function(v) {
            }
        }
    ]), D;
}(), E = function() {
    "use strict";
    function E() {
        _classCallCheck(this, E);
    }
    return _createClass(E, null, [
        {
            key: "x",
            get: function() {
                return 1;
            },
            set: function(v) {
            }
        }
    ]), E;
}();
