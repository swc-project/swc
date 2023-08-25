//// [partiallyAnnotatedFunctionInferenceWithTypeParameter.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
// exactly
test(function(t1, t2) {
    t2.test2;
}), test(function(t1, t2) {
    t2.test2;
}), // zero arg
test(function() {}), // fewer args
test(function(t1) {}), // rest arg
test(function() {
    for(var _len = arguments.length, ts = Array(_len), _key = 0; _key < _len; _key++)ts[_key] = arguments[_key];
}), // source function has rest arg
testRest(function(t1) {}), testRest(function(t1, t2, t3) {}), testRest(function(t1, t2, t3) {}), testRest(function(t1, t2, t3) {}), testRest(function(t2) {
    for(var _len = arguments.length, t3 = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)t3[_key - 1] = arguments[_key];
}), testRest(function(t2) {
    for(var _len = arguments.length, t3 = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)t3[_key - 1] = arguments[_key];
});
