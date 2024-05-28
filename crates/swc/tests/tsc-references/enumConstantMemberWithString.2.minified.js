//// [enumConstantMemberWithString.ts]
var T1, T2, T3;
(T1 = {}).a = "1", T1.b = "12", T1.c = "123", T1[T1.d = NaN] = "d", T1.e = "a1", (T2 = {}).a = "1", T2.b = "12", (T3 = {}).a = "1", T3.b = "12", T3[T3.c = 1] = "c", T3[T3.d = 3] = "d";
