import * as swcHelpers from "@swc/helpers";
var _staticProp = (swcHelpers.classNameTDZError("C"), C).staticProp, _staticProp1 = (swcHelpers.classNameTDZError("C"), C).staticProp, _staticProp2 = (swcHelpers.classNameTDZError("C"), C).staticProp;
// @target: es6
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    var _proto = C.prototype;
    _proto[_staticProp2] = function() {};
    swcHelpers.createClass(C, [
        {
            key: _staticProp,
            get: function get() {
                return "hello";
            }
        },
        {
            key: _staticProp1,
            set: function set(x) {
                var y = x;
            }
        }
    ]);
    return C;
}();
C.staticProp = 10;
