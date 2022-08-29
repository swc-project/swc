//// [nullishCoalescingOperatorInParameterInitializer.2.ts]
// https://github.com/microsoft/TypeScript/issues/36295
var a = function() {
    return undefined;
};
var ref;
(function() {
    var b = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : (ref = a()) !== null && ref !== void 0 ? ref : "d";
    var a1;
})();
var x = "";
var ref1;
(function() {
    var b = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : (ref1 = a()) !== null && ref1 !== void 0 ? ref1 : "d", d = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : x;
    var x1;
})();
