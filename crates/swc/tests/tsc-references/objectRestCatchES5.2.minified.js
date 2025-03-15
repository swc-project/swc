//// [objectRestCatchES5.ts]
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
try {} catch (_param) {
    _param.a, _object_without_properties(_param, [
        "a"
    ]);
}
