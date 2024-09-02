//// [partiallyAnnotatedFunctionInferenceWithTypeParameter.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var D = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits(D, C);
    function D() {
        _class_call_check(this, D);
        return _call_super(this, D, arguments);
    }
    return D;
}(C);
// exactly
test(function(t1, t2) {
    t2.test2;
});
test(function(t1, t2) {
    t2.test2;
});
// zero arg
test(function() {});
// fewer args
test(function(t1) {});
// rest arg
test(function() {
    for(var _len = arguments.length, ts = new Array(_len), _key = 0; _key < _len; _key++){
        ts[_key] = arguments[_key];
    }
});
// source function has rest arg
testRest(function(t1) {});
testRest(function(t1, t2, t3) {});
testRest(function(t1, t2, t3) {});
testRest(function(t1, t2, t3) {});
testRest(function(t2) {
    for(var _len = arguments.length, t3 = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        t3[_key - 1] = arguments[_key];
    }
});
testRest(function(t2) {
    for(var _len = arguments.length, t3 = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        t3[_key - 1] = arguments[_key];
    }
});
