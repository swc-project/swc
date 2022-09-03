//// [parameterInitializersForwardReferencing.2.ts]
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
function a() {}
function b(_param = a()) {
    var { b =a()  } = _param;
    _object_without_properties(_param, [
        "b"
    ]);
}
let x = "";
function c(_param = a(), d = "") {
    var { b  } = _param;
    _object_without_properties(_param, [
        "b"
    ]);
}
