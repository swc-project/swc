//// [templateStringInNewExpression.ts]
new ("abc".concat(0, "abc"))("hello ".concat(0, " world"), "   ", "1".concat(2, "3"));
