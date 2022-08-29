//// [nullishCoalescingOperatorInParameterInitializer.ts]
// https://github.com/microsoft/TypeScript/issues/36295
var a = function() {
    return undefined;
};
var ref;
(function() {
    var b = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : (ref = a()) !== null && ref !== void 0 ? ref : "d";
})();
