import * as swcHelpers from "@swc/helpers";
// @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: ./out
// @declaration: true
// @filename: bug38550.js
export var Clazz = /*#__PURE__*/ function() {
    "use strict";
    function Clazz() {
        swcHelpers.classCallCheck(this, Clazz);
    }
    var _proto = Clazz.prototype;
    /**
   * @param {function(this:Object, ...*):*} functionDeclaration
   */ _proto.method = function method(functionDeclaration) {};
    return Clazz;
}();
