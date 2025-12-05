//// [objectRestParameterES5.ts]
import "@swc/helpers/_/_class_call_check";
import "@swc/helpers/_/_create_class";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
function foobar() {
    var _0 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : void 0, tmp = _sliced_to_array([
        _0
    ], 1)[0], _ref2 = void 0 === tmp ? {} : tmp;
    _ref2.bar, _object_without_properties(_ref2, [
        "bar"
    ]);
}
suddenly(function(_0) {
    return _0.x, _object_without_properties(_0, [
        "x"
    ]).y;
}), suddenly(function() {
    var _0 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : void 0, tmp = _sliced_to_array([
        _0
    ], 1)[0], _ref2 = void 0 === tmp ? {
        x: {
            z: 1,
            ka: 1
        },
        y: 'noo'
    } : tmp, _ref3 = _ref2.x, nested = (_ref3.z, _object_without_properties(_ref3, [
        "z"
    ]));
    return _object_without_properties(_ref2, [
        "x"
    ]).y + nested.ka;
}), foobar(), foobar({
    baz: 'hello'
}), foobar({
    bar: {
        greeting: 'hello'
    }
});
