import * as swcHelpers from "@swc/helpers";
var _staticProp = (swcHelpers.classNameTDZError("C"), C).staticProp, _staticProp1 = (swcHelpers.classNameTDZError("C"), C).staticProp, _staticProp2 = (swcHelpers.classNameTDZError("C"), C).staticProp;
var C = // @target: es6
/*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
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
        },
        {
            key: _staticProp2,
            value: function value() {}
        }
    ]);
    return C;
}();
C.staticProp = 10;
