//// [enumConstantMemberWithString.ts]
var T1, T2, T3, T4, T5, T6;
!function(T1) {
    T1.a = "1", T1.b = "12", T1.c = "123", T1[T1.d = "a" - "a"] = "d", T1.e = "a1";
}(T1 || (T1 = {})), function(T2) {
    T2.a = "1", T2.b = "12";
}(T2 || (T2 = {})), function(T3) {
    T3.a = "1", T3.b = "12", T3[T3.c = 1] = "c", T3[T3.d = 3] = "d";
}(T3 || (T3 = {})), function(T4) {
    T4.a = "1";
}(T4 || (T4 = {})), function(T5) {
    T5.a = "12";
}(T5 || (T5 = {})), function(T6) {
    T6.a = "1", T6.b = "12";
}(T6 || (T6 = {}));
