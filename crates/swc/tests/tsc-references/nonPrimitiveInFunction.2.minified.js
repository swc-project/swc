//// [nonPrimitiveInFunction.ts]
var nonPrimitive, primitive;
function takeObject(o) {}
function returnObject() {
    return {};
}
function returnError() {
    return 123;
}
takeObject(nonPrimitive), nonPrimitive = returnObject(), takeObject(primitive), primitive = returnObject();
