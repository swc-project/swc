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
    swcHelpers.createClass(Clazz, [
        {
            /**
   * @param {function(this:Object, ...*):*} functionDeclaration
   */ key: "method",
            value: function method(functionDeclaration) {}
        }
    ]);
    return Clazz;
}();
