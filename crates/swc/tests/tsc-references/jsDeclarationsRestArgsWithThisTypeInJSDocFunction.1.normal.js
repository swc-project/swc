//// [bug38550.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export var Clazz = /*#__PURE__*/ function() {
    "use strict";
    function Clazz() {
        _class_call_check(this, Clazz);
    }
    var _proto = Clazz.prototype;
    /**
   * @param {function(this:Object, ...*):*} functionDeclaration
   */ _proto.method = function method(functionDeclaration) {};
    return Clazz;
}();
