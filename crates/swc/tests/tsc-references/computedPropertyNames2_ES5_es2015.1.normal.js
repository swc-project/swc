// @target: es5
var methodName = "method";
var accessorName = "accessor";
let _methodName = methodName, _methodName1 = methodName, _accessorName = accessorName, _accessorName1 = accessorName, _accessorName2 = accessorName, _accessorName3 = accessorName;
class C {
    [_methodName]() {}
    static [_methodName1]() {}
    get [_accessorName]() {}
    set [_accessorName1](v) {}
    static get [_accessorName2]() {}
    static set [_accessorName3](v) {}
}
