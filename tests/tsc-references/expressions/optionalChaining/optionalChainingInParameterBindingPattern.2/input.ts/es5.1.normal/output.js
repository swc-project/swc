var ref, ref1;
// @target: esnext,es2015,es5
// @noTypesAndSymbols: true
// @noEmit: true
// https://github.com/microsoft/TypeScript/issues/36295
var a = function() {
    return undefined;
};
(function(param) {
    var tmp = param[(ref = a()) === null || ref === void 0 ? void 0 : ref.d], c = tmp === void 0 ? "" : tmp;
    var a;
})();
var x = "";
(function(param, param1) {
    var c = param[(ref1 = a()) === null || ref1 === void 0 ? void 0 : ref1.d], d = param1 === void 0 ? x : param1;
    var x1;
})();
