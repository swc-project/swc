//// [ModuleWithExportedAndNonExportedEnums.ts]
var A, A1, Day, Color, Day1;
(Color = (A1 = A || (A = {})).Color || (A1.Color = {}))[Color.Red = 0] = "Red", Color[Color.Blue = 1] = "Blue", (Day1 = Day || (Day = {}))[Day1.Monday = 0] = "Monday", Day1[Day1.Tuesday = 1] = "Tuesday", A.Color.Red, A.Day.Monday;
