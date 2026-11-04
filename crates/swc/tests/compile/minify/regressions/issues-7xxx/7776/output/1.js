import { _ as _object_without_properties_loose } from "@swc/helpers/_/_object_without_properties_loose";
function fn(_0) {
    var _ref = _0[0], _rest = _0.slice(1), foo = _ref.foo, flags = _object_without_properties_loose(_ref, [
        "foo"
    ]), bar = _rest[0].bar;
    console.log(flags.rangeChanged);
}
