//// [enumMerging.ts]
var M1, M2, M3, M4, M5, M6;
!function(M1) {
    var EImpl1, EConst1, EImpl11, EImpl12, EConst11, EConst12;
    (EImpl11 = EImpl1 || (EImpl1 = {}))[EImpl11.A = 0] = "A", EImpl11[EImpl11.B = 1] = "B", EImpl11[EImpl11.C = 2] = "C", (EImpl12 = EImpl1 || (EImpl1 = {}))[EImpl12.D = 1] = "D", EImpl12[EImpl12.E = 2] = "E", EImpl12[EImpl12.F = 3] = "F", (EConst11 = EConst1 = M1.EConst1 || (M1.EConst1 = {}))[EConst11.A = 3] = "A", EConst11[EConst11.B = 2] = "B", EConst11[EConst11.C = 1] = "C", (EConst12 = EConst1 = M1.EConst1 || (M1.EConst1 = {}))[EConst12.D = 7] = "D", EConst12[EConst12.E = 9] = "E", EConst12[EConst12.F = 8] = "F", EConst1.A, EConst1.B, EConst1.C, EConst1.D, EConst1.E, EConst1.F;
}(M1 || (M1 = {})), function(M2) {
    var EComp2, EComp21, EComp22;
    (EComp21 = EComp2 = M2.EComp2 || (M2.EComp2 = {}))[EComp21.A = 3] = "A", EComp21[EComp21.B = 3] = "B", EComp21[EComp21.C = 3] = "C", (EComp22 = EComp2 = M2.EComp2 || (M2.EComp2 = {}))[EComp22.D = 3] = "D", EComp22[EComp22.E = 3] = "E", EComp22[EComp22.F = 3] = "F", EComp2.A, EComp2.B, EComp2.C, EComp2.D, EComp2.E, EComp2.F;
}(M2 || (M2 = {})), function(M3) {
    var EInit, EInit1, EInit2;
    (EInit1 = EInit || (EInit = {}))[EInit1.A = 0] = "A", EInit1[EInit1.B = 1] = "B", (EInit2 = EInit || (EInit = {}))[EInit2.C = 1] = "C", EInit2[EInit2.D = 2] = "D", EInit2[EInit2.E = 3] = "E";
}(M3 || (M3 = {})), function(M4) {
    var Color;
    (Color = M4.Color || (M4.Color = {}))[Color.Red = 0] = "Red", Color[Color.Green = 1] = "Green", Color[Color.Blue = 2] = "Blue";
}(M4 || (M4 = {})), function(M5) {
    var Color;
    (Color = M5.Color || (M5.Color = {}))[Color.Red = 0] = "Red", Color[Color.Green = 1] = "Green", Color[Color.Blue = 2] = "Blue";
}(M5 || (M5 = {})), function(M6) {
    var A, Color;
    (Color = (A = M6.A || (M6.A = {})).Color || (A.Color = {}))[Color.Red = 0] = "Red", Color[Color.Green = 1] = "Green", Color[Color.Blue = 2] = "Blue";
}(M6 || (M6 = {})), function(M6) {
    var A, Color, A1;
    (Color = (A = A1 = M6.A || (M6.A = {})).Color || (A.Color = {}))[Color.Yellow = 1] = "Yellow", A1.Color.Yellow, A1.Color.Red;
}(M6 || (M6 = {}));
