//// [uniqueSymbolsDeclarationsErrors.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    obj: ()=>obj,
    classExpression: ()=>classExpression,
    funcInferredReturnType: ()=>funcInferredReturnType,
    ClassWithPrivateNamedProperties: ()=>ClassWithPrivateNamedProperties,
    ClassWithPrivateNamedMethods: ()=>ClassWithPrivateNamedMethods,
    ClassWithPrivateNamedAccessors: ()=>ClassWithPrivateNamedAccessors
});
const obj = {
    method1: (p)=>p,
    method2: (p)=>p
}, classExpression = class {
    method1(p) {
        return p;
    }
    method2(p) {
        return p;
    }
};
function funcInferredReturnType(obj) {
    return obj;
}
class ClassWithPrivateNamedProperties {
}
class ClassWithPrivateNamedMethods {
    [s]() {}
    static [s]() {}
}
class ClassWithPrivateNamedAccessors {
    get [s]() {}
    set [s](v) {}
    static get [s]() {}
    static set [s](v) {}
}
