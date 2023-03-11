//// [variance.ts]
// Test cases for parameter variances affected by conditional types.
// Repro from #30047
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
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
(function() {
    Bar.instance = [];
})();
