//// [functionParameterObjectRestAndInitializers.ts]
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
// https://github.com/microsoft/TypeScript/issues/47079
function f(_0, _1 = void 0) {
    let _ref = [
        _0,
        _1
    ], [_ref1, ..._rest] = _ref, { a } = _ref1, x = _object_without_properties(_ref1, [
        "a"
    ]), [b = a] = _rest;
    return b;
}
function g(_0, _1 = void 0) {
    let _ref = [
        _0,
        _1
    ], [_ref1, ..._rest] = _ref, { a } = _ref1, x = _object_without_properties(_ref1, [
        "a"
    ]), [b = ({ a }, b = a)=>{}] = _rest;
    return b;
}
