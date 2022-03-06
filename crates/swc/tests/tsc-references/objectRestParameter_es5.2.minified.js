import * as swcHelpers from "@swc/helpers";
suddenly(function(_param) {
    return _param.x, swcHelpers.objectWithoutProperties(_param, [
        "x"
    ]).y;
}), suddenly(function() {
    var _param = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
        x: {
            z: 1,
            ka: 1
        },
        y: "noo"
    }, _z = _param.x.z, nested = swcHelpers.objectWithoutProperties(_param.x, [
        "z"
    ]), rest = swcHelpers.objectWithoutProperties(_param, [
        "x"
    ]);
    return rest.y + nested.ka;
});
var C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return swcHelpers.createClass(C, [
        {
            key: "m",
            value: function(_param) {
                _param.a, swcHelpers.objectWithoutProperties(_param, [
                    "a"
                ]);
            }
        },
        {
            key: "p",
            set: function(_param) {
                _param.a, swcHelpers.objectWithoutProperties(_param, [
                    "a"
                ]);
            }
        }
    ]), C;
}();
function foobar() {
    var _param = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    _param.bar, swcHelpers.objectWithoutProperties(_param, [
        "bar"
    ]);
}
foobar(), foobar({
    baz: "hello"
}), foobar({
    bar: {
        greeting: "hello"
    }
});
