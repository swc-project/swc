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
var b;
var _b = b, _undefined = undefined;
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
    }
    _createClass(C, [
        {
            key: _b,
            get: function get() {
                return 0;
            }
        },
        {
            key: [],
            get: function get() {
                return 0;
            }
        },
        {
            key: {},
            set: function set(v) {}
        },
        {
            key: null,
            set: function set(v) {}
        }
    ], [
        {
            key: true,
            set: function set(v) {}
        },
        {
            key: _undefined,
            get: function get() {
                return 0;
            }
        }
    ]);
    return C;
}();
