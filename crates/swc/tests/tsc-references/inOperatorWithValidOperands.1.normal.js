//// [inOperatorWithValidOperands.ts]
var x;
// valid left operands
// the left operand is required to be of type Any, the String primitive type, or the Number primitive type
var a1;
var a2;
var a3;
var a4;
var ra1 = x in x;
var ra2 = a1 in x;
var ra3 = a2 in x;
var ra4 = '' in x;
var ra5 = 0 in x;
var ra6 = a3 in x;
var ra7 = a4 in x;
// valid right operands
// the right operand is required to be of type Any, an object type, or a type parameter type
var b1;
var rb1 = x in b1;
var rb2 = x in {};
function foo(t) {
    var rb3 = x in t;
}
function unionCase(t) {
    var rb4 = x in t;
}
function unionCase2(t) {
    var rb5 = x in t;
}
var c1;
var c2;
var c3;
var rc1 = x in c1;
var rc2 = x in (c2 || c3);
