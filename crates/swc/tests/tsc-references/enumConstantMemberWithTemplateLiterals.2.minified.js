//// [enumConstantMemberWithTemplateLiterals.ts]
var T2, T4, T5, T6;
(T2 = {}).a = "1", T2.b = "2", T2[T2.c = 3] = "c", (T4 = {}).a = "1", T4.b = "11", T4.c = "12", T4.d = "21", T4.e = "211", (T5 = {}).a = "1", T5.b = "12", T5.c = "123", T5[T5.d = 1] = "d", T5[T5.e = 0] = "e", T5.f = "11", T5.g = "123", T5[T5.h = 1] = "h", (T6 = {})[T6.a = 1] = "a", T6[T6.b = 2] = "b";
