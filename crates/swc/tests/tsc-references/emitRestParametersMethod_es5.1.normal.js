import * as swcHelpers from "@swc/helpers";
// @target: es5
var C = /*#__PURE__*/ function() {
    "use strict";
    function C(name) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        swcHelpers.classCallCheck(this, C);
    }
    var _proto = C.prototype;
    _proto.bar = function bar() {
        for(var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++){
            rest[_key] = arguments[_key];
        }
    };
    _proto.foo = function foo(x) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
    };
    return C;
}();
var D = /*#__PURE__*/ function() {
    "use strict";
    function D() {
        for(var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++){
            rest[_key] = arguments[_key];
        }
        swcHelpers.classCallCheck(this, D);
    }
    var _proto = D.prototype;
    _proto.bar = function bar() {
        for(var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++){
            rest[_key] = arguments[_key];
        }
    };
    _proto.foo = function foo(x) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
    };
    return D;
}();
