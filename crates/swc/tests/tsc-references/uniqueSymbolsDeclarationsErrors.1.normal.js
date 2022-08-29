//// [uniqueSymbolsDeclarationsErrors.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    obj: ()=>obj,
    classExpression: ()=>classExpression,
    funcInferredReturnType: ()=>funcInferredReturnType,
    ClassWithPrivateNamedProperties: ()=>ClassWithPrivateNamedProperties,
    ClassWithPrivateNamedMethods: ()=>ClassWithPrivateNamedMethods,
    ClassWithPrivateNamedAccessors: ()=>ClassWithPrivateNamedAccessors
});
const obj = {
    method1 (p) {
        return p;
    },
    method2 (p) {
        return p;
    }
};
const classExpression = class {
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
    get [s]() {
        return undefined;
    }
    set [s](v) {}
    static get [s]() {
        return undefined;
    }
    static set [s](v) {}
}
