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
var C = // @target: es5
/*#__PURE__*/ function() {
    "use strict";
    function C(t, z, x, param) {
        var y = param === void 0 ? "hello" : param;
        _classCallCheck(this, C);
    }
    _createClass(C, [
        {
            key: "foo",
            value: function foo(x, param) {
                var t = param === void 0 ? false : param;
            }
        },
        {
            key: "foo1",
            value: function foo1(x, param) {
                var t = param === void 0 ? false : param;
                for(var _len = arguments.length, rest = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
                    rest[_key - 2] = arguments[_key];
                }
            }
        },
        {
            key: "bar",
            value: function bar(param) {
                var t = param === void 0 ? false : param;
            }
        },
        {
            key: "boo",
            value: function boo(param) {
                var t = param === void 0 ? false : param;
                for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
                    rest[_key - 1] = arguments[_key];
                }
            }
        }
    ]);
    return C;
}();
var D = function D(param) {
    "use strict";
    var y = param === void 0 ? "hello" : param;
    _classCallCheck(this, D);
};
var E = function E(param) {
    "use strict";
    var y = param === void 0 ? "hello" : param;
    for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        rest[_key - 1] = arguments[_key];
    }
    _classCallCheck(this, E);
};
