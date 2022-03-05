import * as swcHelpers from "@swc/helpers";
// @target: es5, es2015, esnext
// @noEmit: true
// @noTypesAndSymbols: true
// https://github.com/microsoft/TypeScript/issues/36295
function a() {}
function b(_param = a()) {
    var { b =a()  } = _param, x = swcHelpers.objectWithoutProperties(_param, [
        "b"
    ]);
    var a1;
}
const x = "";
function c(_param = a(), d = x) {
    var { b  } = _param, c = swcHelpers.objectWithoutProperties(_param, [
        "b"
    ]);
    var x;
}
