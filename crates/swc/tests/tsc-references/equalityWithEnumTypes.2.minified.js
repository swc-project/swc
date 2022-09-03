//// [equalityWithEnumTypes.ts]
var E1, E2;
function f1(v) {}
function f2(v) {}
!function(E1) {
    E1[E1.a = 1] = "a", E1[E1.b = 2] = "b";
}(E1 || (E1 = {})), function(E2) {
    E2[E2.a = 1] = "a", E2[E2.b = 2] = "b";
}(E2 || (E2 = {}));
