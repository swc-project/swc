const value = 1;
var RuntimeValue = /*#__PURE__*/ function(RuntimeValue) {
    RuntimeValue[RuntimeValue["A"] = 2] = "A";
    return RuntimeValue;
}(RuntimeValue || {});
(function(Runtime) {
    Runtime.Alias = RuntimeValue;
})(Runtime || (Runtime = {}));
var Runtime;
