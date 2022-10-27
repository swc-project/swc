//// [bestCommonTypeOfTuple.ts]
var E1, E2, t2, t4;
!function(E1) {
    E1[E1.one = 0] = "one";
}(E1 || (E1 = {})), function(E2) {
    E2[E2.two = 0] = "two";
}(E2 || (E2 = {})), t2 = [
    E1.one,
    E2.two
], t4 = [
    E1.one,
    E2.two,
    20
], t2[2], t4[3];
