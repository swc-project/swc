//// [nonPrimitiveInFunction.ts]
function takeObject(o) {}
function returnObject() {
    return {};
}
var nonPrimitive;
var primitive;
takeObject(nonPrimitive);
nonPrimitive = returnObject();
takeObject(primitive); // expect error
primitive = returnObject(); // expect error
function returnError() {
    var ret = 123;
    return ret; // expect error
}
