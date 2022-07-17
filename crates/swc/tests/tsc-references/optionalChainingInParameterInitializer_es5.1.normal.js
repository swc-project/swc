// @target: esnext,es2015,es5
// @noTypesAndSymbols: true
// https://github.com/microsoft/TypeScript/issues/36295
var ref;
var a = function() {
    return undefined;
};
(function() {
    var b = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : (ref = a()) === null || ref === void 0 ? void 0 : ref.d;
})();
