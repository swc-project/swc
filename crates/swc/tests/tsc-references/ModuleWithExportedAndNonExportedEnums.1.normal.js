//// [ModuleWithExportedAndNonExportedEnums.ts]
(function(A) {
    (function(Color) {
        Color[Color["Red"] = 0] = "Red";
        Color[Color["Blue"] = 1] = "Blue";
    })(A.Color || (A.Color = {}));
    var Day = /*#__PURE__*/ function(Day) {
        Day[Day["Monday"] = 0] = "Monday";
        Day[Day["Tuesday"] = 1] = "Tuesday";
        return Day;
    }({});
})(A || (A = {}));
// not an error since exported
var a = A.Color.Red;
// error not exported
var b = A.Day.Monday;
var A;
