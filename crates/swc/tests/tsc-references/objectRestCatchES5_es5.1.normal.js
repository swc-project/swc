import _object_without_properties from "@swc/helpers/lib/_object_without_properties.js";
var a = 1, b = 2;
try {} catch (_param) {
    var a1 = _param.a, b1 = _object_without_properties(_param, [
        "a"
    ]);
}
