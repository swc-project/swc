//// [bug38550.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var Clazz = function() {
    function Clazz() {
        _class_call_check(this, Clazz);
    }
    return(/**
   * @param {function(this:Object, ...*):*} functionDeclaration
   */ Clazz.prototype.method = function(functionDeclaration) {}, Clazz);
}();
