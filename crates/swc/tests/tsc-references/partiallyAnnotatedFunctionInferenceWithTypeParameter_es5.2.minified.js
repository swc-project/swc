import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = function() {
    "use strict";
    _class_call_check(this, C);
}, D = function(C) {
    "use strict";
    _inherits(D, C);
    var _super = _create_super(D);
    function D() {
        return _class_call_check(this, D), _super.apply(this, arguments);
    }
    return D;
}(C);
test(function(t1, t2) {
    t2.test2;
}), test(function(t1, t2) {
    t2.test2;
}), test(function() {}), test(function(t1) {}), test(function() {
    for(var _len = arguments.length, ts = Array(_len), _key = 0; _key < _len; _key++)ts[_key] = arguments[_key];
}), testRest(function(t1) {}), testRest(function(t1, t2, t3) {}), testRest(function(t1, t2, t3) {}), testRest(function(t1, t2, t3) {}), testRest(function(t2) {
    for(var _len = arguments.length, t3 = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)t3[_key - 1] = arguments[_key];
}), testRest(function(t2) {
    for(var _len = arguments.length, t3 = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)t3[_key - 1] = arguments[_key];
});
