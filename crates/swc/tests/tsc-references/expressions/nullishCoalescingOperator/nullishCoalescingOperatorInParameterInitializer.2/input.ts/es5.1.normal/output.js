// @target: esnext,es2015,es5
// @noTypesAndSymbols: true
// @noEmit: true
// https://github.com/microsoft/TypeScript/issues/36295
var a = function() {
    return undefined;
};
var ref;
(function(param) {
    var b = param === void 0 ? (ref = a()) !== null && ref !== void 0 ? ref : "d" : param;
    var a1;
})();
var x = "";
var ref1;
(function(param, param1) {
    var b = param === void 0 ? (ref1 = a()) !== null && ref1 !== void 0 ? ref1 : "d" : param, d = param1 === void 0 ? x : param1;
    var x1;
})();
