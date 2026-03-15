const runtime = Math.random() > 0.5 ? 10 : 20;
var Other = /*#__PURE__*/ function(Other) {
    Other[Other["Base"] = 5] = "Base";
    return Other;
}(Other || {});
var Value = function(Value) {
    Value[Value["A"] = 1] = "A";
    Value[Value["B"] = 3] = "B";
    Value[Value["C"] = 9] = "C";
    Value["D"] = "9";
    Value[Value["E"] = 9 + runtime] = "E";
    Value[Value["F"] = 8] = "F";
    Value[Value["G"] = Value.E + 8] = "G";
    return Value;
}(Value || {});
console.log(1, 3, 9, "9", Value.E, 8, Value.G);
