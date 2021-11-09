// @target: esnext,es2015,es5
// @noTypesAndSymbols: true
// @noEmit: true
// https://github.com/microsoft/TypeScript/issues/36295
var a = function() {
    return undefined;
};
var ref;
(function(param) {
    var tmp = param[(ref = a()) !== null && ref !== void 0 ? ref : "d"], c = tmp === void 0 ? "" : tmp;
    var a;
})();
var x = "";
var ref1;
(function(param) {
    var tmp = param[(ref1 = a()) !== null && ref1 !== void 0 ? ref1 : "d"], c = tmp === void 0 ? "" : tmp, _d = param.d, d = _d === void 0 ? x : _d;
    var x1;
})();
