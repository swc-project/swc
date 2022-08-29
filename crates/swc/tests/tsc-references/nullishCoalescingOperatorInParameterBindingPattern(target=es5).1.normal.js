//// [nullishCoalescingOperatorInParameterBindingPattern.ts]
// https://github.com/microsoft/TypeScript/issues/36295
var a = function() {
    return undefined;
};
var ref;
(function(param) {
    var tmp = param[(ref = a()) !== null && ref !== void 0 ? ref : "d"], c = tmp === void 0 ? "" : tmp;
})();
