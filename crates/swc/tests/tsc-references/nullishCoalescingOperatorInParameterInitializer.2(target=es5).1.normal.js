//// [nullishCoalescingOperatorInParameterInitializer.2.ts]
// https://github.com/microsoft/TypeScript/issues/36295
var a = function() {
    return undefined;
};
var _a;
(function() {
    var b = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : (_a = a()) !== null && _a !== void 0 ? _a : "d";
    var a1;
})();
var x = "";
var _a1;
(function() {
    var b = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : (_a1 = a()) !== null && _a1 !== void 0 ? _a1 : "d", d = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : x;
    var x1;
})();
