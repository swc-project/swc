//// [optionalChainingInParameterInitializer.ts]
// https://github.com/microsoft/TypeScript/issues/36295
var a = function() {};
!function() {
    var _a;
    arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null === (_a = a()) || void 0 === _a || _a.d;
}();
