//// [bug38550.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var Clazz = function() {
    function Clazz() {
        _class_call_check(this, Clazz);
    }
    var _proto = Clazz.prototype;
    return _proto.method = function(functionDeclaration) {}, Clazz;
}();
