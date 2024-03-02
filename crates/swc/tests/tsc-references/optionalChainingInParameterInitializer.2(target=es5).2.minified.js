//// [optionalChainingInParameterInitializer.2.ts]
var a = function() {};
!function() {
    var _a;
    arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null === (_a = a()) || void 0 === _a || _a.d;
}(), function() {
    var _a;
    arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null === (_a = a()) || void 0 === _a || _a.d, arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
}();
