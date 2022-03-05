import * as swcHelpers from "@swc/helpers";
// @target: es5
function cloneAgain(_param) {
    var a = _param.a, clone = swcHelpers.objectWithoutProperties(_param, [
        "a"
    ]);
}
suddenly(function(_param) {
    var a = _param.x, rest = swcHelpers.objectWithoutProperties(_param, [
        "x"
    ]);
    return rest.y;
});
suddenly(function() {
    var _param = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
        x: {
            z: 1,
            ka: 1
        },
        y: 'noo'
    };
    var _x = _param.x, _z = _x.z, z = _z === void 0 ? 12 : _z, nested = swcHelpers.objectWithoutProperties(_param.x, [
        "z"
    ]), rest = swcHelpers.objectWithoutProperties(_param, [
        "x"
    ]);
    return rest.y + nested.ka;
});
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    swcHelpers.createClass(C, [
        {
            key: "m",
            value: function m(_param) {
                var a = _param.a, clone = swcHelpers.objectWithoutProperties(_param, [
                    "a"
                ]);
            // actually, never mind, don't clone
            }
        },
        {
            key: "p",
            set: function set(_param) {
                var a = _param.a, clone = swcHelpers.objectWithoutProperties(_param, [
                    "a"
                ]);
            // actually, never mind, don't clone
            }
        }
    ]);
    return C;
}();
function foobar() {
    var _param = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    var _bar = _param.bar, bar = _bar === void 0 ? {} : _bar, opts = swcHelpers.objectWithoutProperties(_param, [
        "bar"
    ]);
}
foobar();
foobar({
    baz: 'hello'
});
foobar({
    bar: {
        greeting: 'hello'
    }
});
