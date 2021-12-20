var nonPrimitive, primitive;
function takeObject(o) {
}
function returnObject() {
    return {
    };
}
takeObject(nonPrimitive), nonPrimitive = returnObject(), takeObject(primitive), primitive = returnObject();
