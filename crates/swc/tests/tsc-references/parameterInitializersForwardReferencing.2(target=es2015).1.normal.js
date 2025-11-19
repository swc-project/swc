//// [parameterInitializersForwardReferencing.2.ts]
// https://github.com/microsoft/TypeScript/issues/36295
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
function a() {}
function b(_param = a()) {
    var { b: b1 = a() } = _param, x = _object_without_properties(_param, [
        "b"
    ]);
    var a1;
}
const x = "";
function c(_param = a(), d = x) {
    var { b } = _param, c1 = _object_without_properties(_param, [
        "b"
    ]);
    var x1;
}
