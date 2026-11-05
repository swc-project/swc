import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
function foo(_0, _1 = void 0) {
    let _ref = [
        _0,
        _1
    ], [_ref1, ..._rest] = _ref, { a } = _ref1, rest = _object_without_properties(_ref1, [
        "a"
    ]), [foo1 = rest] = _rest;
}
