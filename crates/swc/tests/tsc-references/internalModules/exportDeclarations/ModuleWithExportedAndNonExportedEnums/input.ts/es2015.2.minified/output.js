var A;
(function(A) {
    var Color, Day;
    let Color;
    (Color = Color || (Color = {
    }))[Color.Red = 0] = "Red", Color[Color.Blue = 1] = "Blue";
    let Day;
    (Day = Day || (Day = {
    }))[Day.Monday = 0] = "Monday", Day[Day.Tuesday = 1] = "Tuesday", A.Color = Color;
})(A || (A = {
})), A.Color.Red, A.Day.Monday;
