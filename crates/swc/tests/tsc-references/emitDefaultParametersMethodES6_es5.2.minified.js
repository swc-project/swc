import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function() {
    "use strict";
    function C(t, z, x) {
        arguments.length > 3 && void 0 !== arguments[3] && arguments[3], _class_call_check(this, C);
    }
    var _proto = C.prototype;
    return _proto.foo = function(x) {
        arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
    }, _proto.foo1 = function(x) {
        arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
        for(var _len = arguments.length, rest = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++)rest[_key - 2] = arguments[_key];
    }, _proto.bar = function() {
        arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
    }, _proto.boo = function() {
        arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)rest[_key - 1] = arguments[_key];
    }, C;
}(), D = function() {
    "use strict";
    arguments.length > 0 && void 0 !== arguments[0] && arguments[0], _class_call_check(this, D);
}, E = function() {
    "use strict";
    arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
    for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)rest[_key - 1] = arguments[_key];
    _class_call_check(this, E);
};
