//// [parameterInitializersForwardReferencing.2.ts]
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
function a() {}
function b() {
    var _param = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : a();
    void 0 === _param.b && a(), _object_without_properties(_param, [
        "b"
    ]);
}
var x = "";
function c() {
    var _param = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : a();
    arguments.length > 1 && void 0 !== arguments[1] && arguments[1], _param.b, _object_without_properties(_param, [
        "b"
    ]);
}
