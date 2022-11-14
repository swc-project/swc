//// [nullishCoalescingOperatorInParameterInitializer.ts]
// https://github.com/microsoft/TypeScript/issues/36295
var a = function() {
    return undefined;
};
var _a;
(function() {
    var b = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : (_a = a()) !== null && _a !== void 0 ? _a : "d";
})();
