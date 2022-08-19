import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
new (function() {
    "use strict";
    function abstract() {
        _class_call_check(this, abstract);
    }
    var _proto = abstract.prototype;
    return _proto.foo = function() {
        return 1;
    }, abstract;
}());
