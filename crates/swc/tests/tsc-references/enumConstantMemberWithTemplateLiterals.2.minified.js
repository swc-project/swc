//// [enumConstantMemberWithTemplateLiterals.ts]
var T1, T2, T3, T4, T5, T6, T7;
!function(T1) {
    T1.a = "1";
}(T1 || (T1 = {})), function(T2) {
    T2.a = "1", T2.b = "2", T2[T2.c = 3] = "c";
}(T2 || (T2 = {})), function(T3) {
    T3.a = "11";
}(T3 || (T3 = {})), function(T4) {
    T4.a = "1", T4.b = "11", T4.c = "12", T4.d = "21", T4.e = "211";
}(T4 || (T4 = {})), function(T5) {
    T5.a = "1", T5.b = "12", T5.c = "123", T5[T5.d = 1] = "d", T5[T5.e = "1" - "1"] = "e", T5.f = "11", T5[T5.g = "123"] = "g", T5[T5.h = 1] = "h";
}(T5 || (T5 = {})), function(T6) {
    T6[T6.a = 1] = "a", T6[T6.b = 2] = "b";
}(T6 || (T6 = {})), function(T7) {
    T7.a = "1", T7.b = "11", T7.c = "21";
}(T7 || (T7 = {}));
