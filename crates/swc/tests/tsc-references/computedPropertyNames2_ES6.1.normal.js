//// [computedPropertyNames2_ES6.ts]
var methodName = "method";
var accessorName = "accessor";
class C {
    [methodName]() {}
    static [methodName]() {}
    get [accessorName]() {}
    set [accessorName](v) {}
    static get [accessorName]() {}
    static set [accessorName](v) {}
}
