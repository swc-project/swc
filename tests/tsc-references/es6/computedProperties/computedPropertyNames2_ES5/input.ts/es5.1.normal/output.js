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
// @target: es5
var methodName = "method";
var accessorName = "accessor";
var tmp = methodName, tmp1 = methodName, tmp2 = accessorName, tmp3 = accessorName, tmp4 = accessorName, tmp5 = accessorName;
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
    }
    _createClass(C, [
        {
            key: tmp,
            value: function value() {
            }
        },
        {
            key: tmp2,
            get: function get() {
            }
        },
        {
            key: tmp3,
            set: function set(v) {
            }
        }
    ], [
        {
            key: tmp1,
            value: function value() {
            }
        },
        {
            key: tmp4,
            get: function get() {
            }
        },
        {
            key: tmp5,
            set: function set(v) {
            }
        }
    ]);
    return C;
}();
