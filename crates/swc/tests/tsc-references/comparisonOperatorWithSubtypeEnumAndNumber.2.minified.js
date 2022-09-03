//// [comparisonOperatorWithSubtypeEnumAndNumber.ts]
!function(E) {
    E[E.a = 0] = "a", E[E.b = 1] = "b", E[E.c = 2] = "c";
}(E || (E = {}));
var E, a, b, ra1 = a < b, ra2 = b < a, ra3 = E.a < b, ra4 = b < E.a, ra5 = E.a < 0, ra6 = 0 < E.a, rb1 = a > b, rb2 = b > a, rb3 = E.a > b, rb4 = b > E.a, rb5 = E.a > 0, rb6 = 0 > E.a, rc1 = a <= b, rc2 = b <= a, rc3 = E.a <= b, rc4 = b <= E.a, rc5 = E.a <= 0, rc6 = 0 <= E.a, rd1 = a >= b, rd2 = b >= a, rd3 = E.a >= b, rd4 = b >= E.a, rd5 = E.a >= 0, rd6 = 0 >= E.a, re1 = a == b, re2 = b == a, re3 = E.a == b, re4 = b == E.a, re5 = 0 == E.a, re6 = 0 == E.a, rf1 = a != b, rf2 = b != a, rf3 = E.a != b, rf4 = b != E.a, rf5 = 0 != E.a, rf6 = 0 != E.a, rg1 = a === b, rg2 = b === a, rg3 = E.a === b, rg4 = b === E.a, rg5 = 0 === E.a, rg6 = 0 === E.a, rh1 = a !== b, rh2 = b !== a, rh3 = E.a !== b, rh4 = b !== E.a, rh5 = 0 !== E.a, rh6 = 0 !== E.a;
