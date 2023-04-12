//// [objectRestCatchES5.ts]
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
var a = 1, b = 2;
try {} catch (_param) {
    var a1 = _param.a, b1 = _object_without_properties(_param, [
        "a"
    ]);
}
