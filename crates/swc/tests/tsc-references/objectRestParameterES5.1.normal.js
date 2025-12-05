//// [objectRestParameterES5.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
function cloneAgain(_0) {
    var a = _0.a, clone = _object_without_properties(_0, [
        "a"
    ]);
}
suddenly(function(_0) {
    var a = _0.x, rest = _object_without_properties(_0, [
        "x"
    ]);
    return rest.y;
});
suddenly(function() {
    var _0 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : void 0;
    var _ref = [
        _0
    ], _ref1 = _sliced_to_array(_ref, 1), tmp = _ref1[0], _ref2 = tmp === void 0 ? {
        x: {
            z: 1,
            ka: 1
        },
        y: 'noo'
    } : tmp, _ref3 = _ref2.x, _ref_z = _ref3.z, z = _ref_z === void 0 ? 12 : _ref_z, nested = _object_without_properties(_ref3, [
        "z"
    ]), rest = _object_without_properties(_ref2, [
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
    _proto.m = function m(_0) {
        var a = _0.a, clone = _object_without_properties(_0, [
            "a"
        ]);
    // actually, never mind, don't clone
    };
    _create_class(C, [
        {
            key: "p",
            set: function set(_0) {
                var a = _0.a, clone = _object_without_properties(_0, [
                    "a"
                ]);
            // actually, never mind, don't clone
            }
        }
    ]);
    return C;
}();
function foobar() {
    var _0 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : void 0;
    var _ref = [
        _0
    ], _ref1 = _sliced_to_array(_ref, 1), tmp = _ref1[0], _ref2 = tmp === void 0 ? {} : tmp, _ref_bar = _ref2.bar, bar = _ref_bar === void 0 ? {} : _ref_bar, opts = _object_without_properties(_ref2, [
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
