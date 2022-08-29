//// [nonPrimitiveInFunction.ts]
var nonPrimitive, primitive;
function takeObject(o) {}
takeObject(nonPrimitive), nonPrimitive = {}, takeObject(primitive), primitive = {};
