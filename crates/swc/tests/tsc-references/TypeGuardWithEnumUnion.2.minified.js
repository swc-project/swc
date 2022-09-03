//// [TypeGuardWithEnumUnion.ts]
var Color;
function f1(x) {}
function f2(x) {}
!function(Color) {
    Color[Color.R = 0] = "R", Color[Color.G = 1] = "G", Color[Color.B = 2] = "B";
}(Color || (Color = {}));
