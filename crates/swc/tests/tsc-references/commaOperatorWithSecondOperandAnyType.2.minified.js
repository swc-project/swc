//// [commaOperatorWithSecondOperandAnyType.ts]
var NUMBER, x;
++NUMBER, "string".charAt(0), x("any"), x.doSomeThing(), ++NUMBER, "string".charAt(0), x("any"), x.doSomeThing();
