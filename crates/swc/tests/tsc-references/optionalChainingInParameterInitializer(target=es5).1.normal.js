//// [optionalChainingInParameterInitializer.ts]
// https://github.com/microsoft/TypeScript/issues/36295
var a = function() {
    return undefined;
};
(function() {
    var b = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
        var _a;
        return (_a = a()) === null || _a === void 0 ? void 0 : _a.d;
    }();
})();
