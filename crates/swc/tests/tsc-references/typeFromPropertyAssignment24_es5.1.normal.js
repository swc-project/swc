import * as swcHelpers from "@swc/helpers";
// @noEmit: true
// @checkJs: true
// @allowJs: true
// @Filename: usage.js
// note that usage is first in the compilation
Outer.Inner.Message = function() {};
var y = new Outer.Inner();
y.name;
/** @type {Outer.Inner} should be instance type, not static type */ var x;
x.name;
// @Filename: def.js
var Outer = {};
Outer.Inner = /*#__PURE__*/ (function() {
    "use strict";
    function _class() {
        swcHelpers.classCallCheck(this, _class);
    }
    swcHelpers.createClass(_class, [
        {
            key: "name",
            value: function name() {
                return 'hi';
            }
        }
    ]);
    return _class;
})();
