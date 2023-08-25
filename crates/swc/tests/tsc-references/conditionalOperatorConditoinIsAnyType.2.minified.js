//// [conditionalOperatorConditoinIsAnyType.ts]
//Cond ? Expr1 : Expr2,  Cond is of any type, Expr1 and Expr2 have the same type
var x;
//Cond is an any type expression
x.doSomeThing(), x("x"), x(x), x("x"), x.doSomeThing(), x.doSomeThing(), x.doSomeThing(), x("x"), x(x), x("x"), x.doSomeThing(), x.doSomeThing();
 // union
