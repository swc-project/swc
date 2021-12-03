var A;
(function(A1) {
    var Color1;
    (function(Color) {
        Color[Color["Red"] = 0] = "Red";
        Color[Color["Blue"] = 1] = "Blue";
    })(Color1 || (Color1 = {
    }));
    var Day1;
    (function(Day) {
        Day[Day["Monday"] = 0] = "Monday";
        Day[Day["Tuesday"] = 1] = "Tuesday";
    })(Day1 || (Day1 = {
    }));
    A1.Color = Color1;
})(A || (A = {
}));
// not an error since exported
var a = A.Color.Red;
// error not exported
var b = A.Day.Monday;
