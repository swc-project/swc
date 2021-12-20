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
var C = // @target: es6
/*#__PURE__*/ function() {
    "use strict";
    function C(name) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        _classCallCheck(this, C);
    }
    _createClass(C, [
        {
            key: "bar",
            value: function bar() {
                for(var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++){
                    rest[_key] = arguments[_key];
                }
            }
        },
        {
            key: "foo",
            value: function foo(x) {
                for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
                    rest[_key - 1] = arguments[_key];
                }
            }
        }
    ]);
    return C;
}();
var D = /*#__PURE__*/ function() {
    "use strict";
    function D() {
        for(var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++){
            rest[_key] = arguments[_key];
        }
        _classCallCheck(this, D);
    }
    _createClass(D, [
        {
            key: "bar",
            value: function bar() {
                for(var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++){
                    rest[_key] = arguments[_key];
                }
            }
        },
        {
            key: "foo",
            value: function foo(x) {
                for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
                    rest[_key - 1] = arguments[_key];
                }
            }
        }
    ]);
    return D;
}();
