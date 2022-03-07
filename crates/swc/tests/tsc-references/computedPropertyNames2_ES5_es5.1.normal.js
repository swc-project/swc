import * as swcHelpers from "@swc/helpers";
// @target: es5
var methodName = "method";
var accessorName = "accessor";
var _methodName = methodName, _methodName1 = methodName, _accessorName = accessorName, _accessorName1 = accessorName, _accessorName2 = accessorName, _accessorName3 = accessorName;
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    var _proto = C.prototype;
    _proto[_methodName] = function() {};
    C[_methodName1] = function() {};
    swcHelpers.createClass(C, [
        {
            key: _accessorName,
            get: function get() {}
        },
        {
            key: _accessorName1,
            set: function set(v) {}
        }
    ], [
        {
            key: _accessorName2,
            get: function get() {}
        },
        {
            key: _accessorName3,
            set: function set(v) {}
        }
    ]);
    return C;
}();
