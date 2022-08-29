//// [constructorTagOnNestedBinaryExpression.js]
// Fixes #35021
/** @constructor */ a = b = function c() {
    console.log(this);
};
