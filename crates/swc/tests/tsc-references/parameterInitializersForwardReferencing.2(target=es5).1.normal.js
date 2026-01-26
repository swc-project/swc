//// [parameterInitializersForwardReferencing.2.ts]
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _to_array } from "@swc/helpers/_/_to_array";
// https://github.com/microsoft/TypeScript/issues/36295
function a() {}
function b() {
    var _0 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : void 0;
    var _ref = [
        _0
    ], _ref1 = _sliced_to_array(_ref, 1), tmp = _ref1[0], _ref2 = tmp === void 0 ? a() : tmp, _ref_b = _ref2.b, b = _ref_b === void 0 ? a() : _ref_b, x = _object_without_properties(_ref2, [
        "b"
    ]);
    var _$a;
}
var x = "";
function c() {
    var _0 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : void 0, _1 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : void 0;
    var _ref = [
        _0,
        _1
    ], _ref1 = _to_array(_ref), tmp = _ref1[0], _ref2 = tmp === void 0 ? a() : tmp, _rest = _ref1.slice(1), b = _ref2.b, c = _object_without_properties(_ref2, [
        "b"
    ]), _rest1 = _sliced_to_array(_rest, 1), tmp1 = _rest1[0], d = tmp1 === void 0 ? x : tmp1;
    var x1;
}
