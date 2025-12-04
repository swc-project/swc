//// [parameterInitializersForwardReferencing.2.ts]
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
// https://github.com/microsoft/TypeScript/issues/36295
function a() {}
function b(_0 = void 0) {
    let _ref = [
        _0
    ], [_ref1 = a()] = _ref, { b: b1 = a() } = _ref1, x = _object_without_properties(_ref1, [
        "b"
    ]);
    var a1;
}
const x = "";
function c(_0 = void 0, _1 = void 0) {
    let _ref = [
        _0,
        _1
    ], [_ref1 = a(), ..._rest] = _ref, { b } = _ref1, c1 = _object_without_properties(_ref1, [
        "b"
    ]), [d = x] = _rest;
    var x1;
}
