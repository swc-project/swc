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
var s;
var n;
var a;
var _s = s, _n = n, tmp = s + s, tmp1 = s + n, tmp2 = +s, _a = a, tmp3 = "hello ".concat(a, " bye");
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
    }
    _createClass(C, [
        {
            key: _s,
            get: function get() {
                return 0;
            }
        },
        {
            key: _n,
            set: function set(v) {}
        },
        {
            key: tmp1,
            set: function set(v) {}
        },
        {
            key: tmp2,
            get: function get() {
                return 0;
            }
        },
        {
            key: 0,
            get: function get() {
                return 0;
            }
        },
        {
            key: _a,
            set: function set(v) {}
        },
        {
            key: "hello bye",
            set: function set(v) {}
        },
        {
            key: tmp3,
            get: function get() {
                return 0;
            }
        }
    ], [
        {
            key: tmp,
            get: function get() {
                return 0;
            }
        },
        {
            key: "",
            set: function set(v) {}
        },
        {
            key: true,
            get: function get() {
                return 0;
            }
        }
    ]);
    return C;
}();
