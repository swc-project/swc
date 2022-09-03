//// [variance.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var foo = {
    prop: !0
}, x = foo, y = foo, z = x, Bar = function() {
    "use strict";
    function Bar() {
        _class_call_check(this, Bar);
    }
    var _proto = Bar.prototype;
    return _proto.cast = function(_name) {}, _proto.pushThis = function() {
        Bar.instance.push(this);
    }, Bar;
}();
Bar.instance = [];
