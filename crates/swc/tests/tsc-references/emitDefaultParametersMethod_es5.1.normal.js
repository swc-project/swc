import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @target: es5
var C = /*#__PURE__*/ function() {
    "use strict";
    function C(t, z, x) {
        var y = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "hello";
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.foo = function foo(x) {
        var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    };
    _proto.foo1 = function foo1(x) {
        var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
        for(var _len = arguments.length, rest = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
            rest[_key - 2] = arguments[_key];
        }
    };
    _proto.bar = function bar() {
        var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
    };
    _proto.boo = function boo() {
        var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
    };
    return C;
}();
var D = function D() {
    "use strict";
    var y = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "hello";
    _class_call_check(this, D);
};
var E = function E() {
    "use strict";
    var y = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "hello";
    for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        rest[_key - 1] = arguments[_key];
    }
    _class_call_check(this, E);
};
