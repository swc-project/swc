//// [commaOperatorWithSecondOperandAnyType.ts]
var NUMBER, x;
++NUMBER, x("any"), x.doSomeThing(), ++NUMBER, x("any"), x.doSomeThing();
