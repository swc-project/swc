//// [objectRestParameterES5.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
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
        y: 'noo'
    };
    var _param_x = _param.x, _param_x_z = _param_x.z, z = _param_x_z === void 0 ? 12 : _param_x_z, nested = _object_without_properties(_param.x, [
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
    var _param_bar = _param.bar, bar = _param_bar === void 0 ? {} : _param_bar, opts = _object_without_properties(_param, [
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
