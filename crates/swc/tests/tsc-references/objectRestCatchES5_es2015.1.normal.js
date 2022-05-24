import _object_without_properties from "@swc/helpers/lib/_object_without_properties.js";
let a = 1, b = 2;
try {} catch (_param) {
    var { a: a1  } = _param, b1 = _object_without_properties(_param, [
        "a"
    ]);
}
