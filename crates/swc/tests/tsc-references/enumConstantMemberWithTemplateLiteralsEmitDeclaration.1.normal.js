//// [enumConstantMemberWithTemplateLiteralsEmitDeclaration.ts]
var T1 = /*#__PURE__*/ function(T1) {
    T1["a"] = "1";
    return T1;
}(T1 || {});
var T2 = /*#__PURE__*/ function(T2) {
    T2["a"] = "1";
    T2["b"] = "2";
    T2[T2["c"] = 3] = "c";
    return T2;
}(T2 || {});
var T3 = /*#__PURE__*/ function(T3) {
    T3["a"] = "11";
    return T3;
}(T3 || {});
var T4 = /*#__PURE__*/ function(T4) {
    T4["a"] = "1";
    T4["b"] = "11";
    T4["c"] = "12";
    T4["d"] = "21";
    T4["e"] = "211";
    return T4;
}(T4 || {});
var T5 = /*#__PURE__*/ function(T5) {
    T5["a"] = "1";
    T5["b"] = "12";
    T5["c"] = "123";
    T5[T5["d"] = 1] = "d";
    return T5;
}(T5 || {});
var T6 = /*#__PURE__*/ function(T6) {
    T6[T6["a"] = 1] = "a";
    T6[T6["b"] = "12".length] = "b";
    return T6;
}(T6 || {});
