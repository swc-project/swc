var A;
(function(A1) {
    let Color;
    (function(Color) {
        Color[Color["Red"] = 0] = "Red";
        Color[Color["Blue"] = 1] = "Blue";
    })(Color || (Color = {
    }));
    let Day;
    (function(Day) {
        Day[Day["Monday"] = 0] = "Monday";
        Day[Day["Tuesday"] = 1] = "Tuesday";
    })(Day || (Day = {
    }));
    A1.Color = Color;
})(A || (A = {
}));
// not an error since exported
var a = A.Color.Red;
// error not exported
var b = A.Day.Monday;
