//// [optionalChainingInParameterInitializer.ts]
var a = function() {};
!function() {
    var _a;
    arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null === (_a = a()) || void 0 === _a || _a.d;
}();
