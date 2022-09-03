//// [inOperatorWithValidOperands.ts]
var x, a1, a2, a3, a4, b1, c1, c2, c3, ra1 = x in x, ra2 = a1 in x, ra3 = a2 in x, ra4 = "" in x, ra5 = 0 in x, ra6 = a3 in x, ra7 = a4 in x, rb1 = x in b1, rb2 = x in {};
function foo(t) {}
function unionCase(t) {}
function unionCase2(t) {}
var rc1 = x in c1, rc2 = x in (c2 || c3);
