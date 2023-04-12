//// [bug38550.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
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
