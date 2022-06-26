import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
suddenly(function(_param) {
    return _param.x, _object_without_properties(_param, [
        "x"
    ]).y;
}), suddenly(function() {
    var _param = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
        x: {
            z: 1,
            ka: 1
        },
        y: "noo"
    }, nested = (_param.x.z, _object_without_properties(_param.x, [
        "z"
    ])), rest = _object_without_properties(_param, [
        "x"
    ]);
    return rest.y + nested.ka;
});
var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.m = function(_param) {
        _param.a, _object_without_properties(_param, [
            "a"
        ]);
    }, _create_class(C, [
        {
            key: "p",
            set: function(_param) {
                _param.a, _object_without_properties(_param, [
                    "a"
                ]);
            }
        }
    ]), C;
}();
function foobar() {
    var _param = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    _param.bar, _object_without_properties(_param, [
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
