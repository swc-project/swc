import { _ as _object_without_properties_loose } from "@swc/helpers/_/_object_without_properties_loose";
function fn(_param) {
    var _ref = _param[0], _rest = _param.slice(1), foo = _ref.foo, flags = _object_without_properties_loose(_ref, [
        "foo"
    ]), bar = _rest[0].bar;
    console.log(flags.rangeChanged);
}
