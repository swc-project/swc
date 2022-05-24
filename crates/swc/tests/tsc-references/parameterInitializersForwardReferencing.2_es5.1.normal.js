import _object_without_properties from "@swc/helpers/lib/_object_without_properties.js";
// @target: es5, es2015, esnext
// @noEmit: true
// @noTypesAndSymbols: true
// https://github.com/microsoft/TypeScript/issues/36295
function a() {}
function b() {
    var _param = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : a();
    var _b = _param.b, b = _b === void 0 ? a() : _b, x = _object_without_properties(_param, [
        "b"
    ]);
    var _$a;
}
var x = "";
function c() {
    var _param = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : a(), d = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : x;
    var b = _param.b, c = _object_without_properties(_param, [
        "b"
    ]);
    var x1;
}
