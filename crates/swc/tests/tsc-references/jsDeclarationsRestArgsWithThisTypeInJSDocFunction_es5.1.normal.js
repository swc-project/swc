import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: ./out
// @declaration: true
// @filename: bug38550.js
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
