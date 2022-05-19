//Cond ? Expr1 : Expr2,  Expr1 and Expr2 have no identical best common type
class X {
}
class A extends X {
}
class B extends X {
}
var x;
var a;
var b;
// No errors anymore, uses union types
true ? a : b;
var result1 = true ? a : b;
//Be contextually typed and and bct is not identical, results in errors that union type is not assignable to target
var result2 = true ? a : b;
var result3 = true ? a : b;
var result31 = true ? a : b;
var result4 = true ? (m)=>m.propertyX1 : (n)=>n.propertyX2;
var result5 = true ? (m)=>m.propertyX1 : (n)=>n.propertyX2;
var result6 = true ? (m)=>m.propertyX1 : (n)=>n.propertyX2;
var result61 = true ? (m)=>m.propertyX1 : (n)=>n.propertyX2;
