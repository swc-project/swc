//// [parameterInitializersForwardReferencing.2.ts]
// https://github.com/microsoft/TypeScript/issues/36295
function a() {}
function b({ b: b1 = a(), ...x } = a()) {
    var a1;
}
const x = "";
function c({ b, ...c1 } = a(), d = x) {
    var x1;
}
