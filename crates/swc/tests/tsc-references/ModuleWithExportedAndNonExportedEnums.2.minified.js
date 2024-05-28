//// [ModuleWithExportedAndNonExportedEnums.ts]
var A, A1, Color, Day;
(Color = (A1 = A = {}).Color || (A1.Color = {}))[Color.Red = 0] = "Red", Color[Color.Blue = 1] = "Blue", (Day = {})[Day.Monday = 0] = "Monday", Day[Day.Tuesday = 1] = "Tuesday", A.Color.Red, A.Day.Monday;
