//// [constructorTagOnNestedBinaryExpression.js]
// Fixes #35021
/** @constructor */ a1 = b1 = function c() {
    console.log(this);
};
