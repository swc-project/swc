import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export var Clazz = function() {
    "use strict";
    function Clazz() {
        _class_call_check(this, Clazz);
    }
    var _proto = Clazz.prototype;
    return _proto.method = function(functionDeclaration) {}, Clazz;
}();
