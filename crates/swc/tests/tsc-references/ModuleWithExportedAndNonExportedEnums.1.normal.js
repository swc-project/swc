//// [ModuleWithExportedAndNonExportedEnums.ts]
var A;
(function(A) {
    var Color;
    (function(Color) {
        Color[Color["Red"] = 0] = "Red";
        Color[Color["Blue"] = 1] = "Blue";
    })(Color = A.Color || (A.Color = {}));
    var Day;
    (function(Day) {
        Day[Day["Monday"] = 0] = "Monday";
        Day[Day["Tuesday"] = 1] = "Tuesday";
    })(Day || (Day = {}));
})(A || (A = {}));
// not an error since exported
var a = A.Color.Red;
// error not exported
var b = A.Day.Monday;
