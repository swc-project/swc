import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
// @target: es2015
function cloneAgain(_param) {
    var a = _param.a, clone = _object_without_properties(_param, [
        "a"
    ]);
}
suddenly(function(_param) {
    var a = _param.x, rest = _object_without_properties(_param, [
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
        y: "noo"
    };
    var _x = _param.x, _z = _x.z, z = _z === void 0 ? 12 : _z, nested = _object_without_properties(_param.x, [
        "z"
    ]), rest = _object_without_properties(_param, [
        "x"
    ]);
    return rest.y + nested.ka;
});
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.m = function m(_param) {
        var a = _param.a, clone = _object_without_properties(_param, [
            "a"
        ]);
    // actually, never mind, don't clone
    };
    _create_class(C, [
        {
            key: "p",
            set: function set(_param) {
                var a = _param.a, clone = _object_without_properties(_param, [
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
    var _bar = _param.bar, bar = _bar === void 0 ? {} : _bar, opts = _object_without_properties(_param, [
        "bar"
    ]);
}
foobar();
foobar({
    baz: "hello"
});
foobar({
    bar: {
        greeting: "hello"
    }
});
