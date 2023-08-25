//// [variance.ts]
// Test cases for parameter variances affected by conditional types.
// Repro from #30047
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
// Repro from #30118
(function() {
    function Bar() {
        _class_call_check(this, Bar);
    }
    var _proto = Bar.prototype;
    return _proto.cast = function(_name) {}, _proto.pushThis = function() {
        Bar.instance.push(this);
    }, Bar;
})().instance = [];
