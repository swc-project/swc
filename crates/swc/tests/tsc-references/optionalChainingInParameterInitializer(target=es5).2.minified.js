//// [optionalChainingInParameterInitializer.ts]
var a = function() {};
!function() {
    var _a;
    arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null == (_a = a()) || _a.d;
}();
