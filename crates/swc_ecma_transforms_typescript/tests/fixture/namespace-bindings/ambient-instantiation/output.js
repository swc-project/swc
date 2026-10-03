(function(VariableOnly) {})(VariableOnly || (VariableOnly = {}));
(function(FunctionOnly) {})(FunctionOnly || (FunctionOnly = {}));
export { FunctionOnly };
export default FunctionOnly;
(function(ClassOnly) {})(ClassOnly || (ClassOnly = {}));
(function(EnumOnly) {})(EnumOnly || (EnumOnly = {}));
(function(ExportedFunction) {})(ExportedFunction || (ExportedFunction = {}));
(function(Qualified) {
    (function(FunctionOnly) {})(Qualified.FunctionOnly || (Qualified.FunctionOnly = {}));
})(Qualified || (Qualified = {}));
(function(Outer) {})(Outer || (Outer = {}));
(function(Nested) {
    (function(Inner) {})(Inner || (Inner = {}));
    var Inner;
})(Nested || (Nested = {}));
(function(Merged) {})(Merged || (Merged = {}));
console.log(Merged);
(function(Merged) {
    Merged.value = 1;
})(Merged || (Merged = {}));
console.log(Merged.value);
var VariableOnly, FunctionOnly, ClassOnly, EnumOnly, Qualified, Outer, Nested, Merged;
export var ExportedFunction;
