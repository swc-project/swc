//// [bug38550.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var Clazz = function() {
    "use strict";
    function Clazz() {
        _class_call_check(this, Clazz);
    }
    return Clazz.prototype.method = function(functionDeclaration) {}, Clazz;
}();
