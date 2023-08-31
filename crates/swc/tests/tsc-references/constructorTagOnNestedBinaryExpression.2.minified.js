//// [constructorTagOnNestedBinaryExpression.js]
// Fixes #35021
/** @constructor */ a = b = function() {
    console.log(this);
};
