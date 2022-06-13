import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
// @target: es5, es2015, esnext
// @noEmit: true
// @noTypesAndSymbols: true
// https://github.com/microsoft/TypeScript/issues/36295
function a() {}
function b(_param = a()) {
    var { b =a()  } = _param, x = _object_without_properties(_param, [
        "b"
    ]);
    var a1;
}
const x = "";
function c(_param = a(), d = x) {
    var { b  } = _param, c = _object_without_properties(_param, [
        "b"
    ]);
    var x;
}
