import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var Bar = function() {
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
