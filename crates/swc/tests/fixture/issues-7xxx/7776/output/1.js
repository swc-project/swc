import { _ as _object_without_properties_loose } from "@swc/helpers/_/_object_without_properties_loose";
function fn(_param) {
    var foo = _param[0].foo, bar = _param[1].bar, flags = _object_without_properties_loose(_param[0], [
        "foo"
    ]);
    console.log(flags.rangeChanged);
}
