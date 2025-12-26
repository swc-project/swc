//// [variance.ts]
// Test cases for parameter variances affected by conditional types.
// Repro from #30047
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var foo = {
    prop: true
};
var x = foo;
var y = foo;
var z = x;
// Repro from #30118
var Bar = /*#__PURE__*/ function() {
    "use strict";
    function Bar() {
        _class_call_check(this, Bar);
    }
    var _proto = Bar.prototype;
    _proto.cast = function cast(_name) {};
    _proto.pushThis = function pushThis() {
        Bar.instance.push(this);
    };
    return Bar;
}();
Bar.instance = [];
