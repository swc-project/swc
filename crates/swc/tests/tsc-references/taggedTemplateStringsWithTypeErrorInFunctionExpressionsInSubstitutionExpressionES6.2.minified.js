//// [taggedTemplateStringsWithTypeErrorInFunctionExpressionsInSubstitutionExpressionES6.ts]
function foo(...rest) {}
foo`${function(x) {}}`;
