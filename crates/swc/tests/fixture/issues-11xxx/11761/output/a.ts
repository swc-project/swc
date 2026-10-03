export var RefType = function(RefType) {
    RefType[RefType["property"] = "11"] = "property";
    RefType[RefType["event"] = "22"] = "event";
    return RefType;
}({});
console.log(RefType.property, RefType.event);
