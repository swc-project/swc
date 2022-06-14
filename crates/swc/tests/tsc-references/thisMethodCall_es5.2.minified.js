import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    return _proto.method = function() {}, _proto.other = function() {
        var _obj, ref;
        null === (ref = (_obj = this).method) || void 0 === ref || ref.call(_obj);
    }, C;
}();
