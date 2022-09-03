//// [parameterInitializersForwardReferencing.2.ts]
function a() {}
function b({ b =a() , ...x } = a()) {}
const x = "";
function c({ b , ...c } = a(), d = "") {}
