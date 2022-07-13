// @target: esnext,es2015,es5
// @noTypesAndSymbols: true
// @noEmit: true
// https://github.com/microsoft/TypeScript/issues/36295
var ref, ref1;
var a = function() {
    return undefined;
};
(function(param) {
    var tmp = param[(ref = a()) === null || ref === void 0 ? void 0 : ref.d], c = tmp === void 0 ? "" : tmp;
    var a1;
})();
var x = "";
(function(param) {
    var c = param[(ref1 = a()) === null || ref1 === void 0 ? void 0 : ref1.d], d = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : x;
    var x1;
})();
