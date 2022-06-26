import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var D = function() {
    "use strict";
    function D() {
        _class_call_check(this, D);
    }
    var _proto = D.prototype;
    return _proto.getData = function() {
        var data = this.data;
        return "string" == typeof data ? data : data.join(" ");
    }, _proto.getData1 = function() {
        return "string" == typeof this.data ? this.data : this.data.join(" ");
    }, D;
}(), o = {
    prop1: "string",
    prop2: !0
};
"string" == typeof o.prop1 && o.prop1.toLowerCase();
var prop1 = o.prop1;
"string" == typeof prop1 && prop1.toLocaleLowerCase();
