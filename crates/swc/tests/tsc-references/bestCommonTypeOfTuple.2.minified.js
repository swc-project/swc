//// [bestCommonTypeOfTuple.ts]
var E1, E2, t2, t4, E11, E21;
(E11 = E1 || (E1 = {}))[E11.one = 0] = "one", (E21 = E2 || (E2 = {}))[E21.two = 0] = "two", t2 = [
    E1.one,
    E2.two
], t4 = [
    E1.one,
    E2.two,
    20
], t2[2], t4[3];
 // number
