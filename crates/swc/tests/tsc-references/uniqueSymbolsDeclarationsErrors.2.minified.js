//// [uniqueSymbolsDeclarationsErrors.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var target = exports, all = {
    ClassWithPrivateNamedAccessors: function() {
        return ClassWithPrivateNamedAccessors;
    },
    ClassWithPrivateNamedMethods: function() {
        return ClassWithPrivateNamedMethods;
    },
    ClassWithPrivateNamedProperties: function() {
        return ClassWithPrivateNamedProperties;
    },
    classExpression: function() {
        return classExpression;
    },
    funcInferredReturnType: function() {
        return funcInferredReturnType;
    },
    obj: function() {
        return obj;
    }
};
for(var name in all)Object.defineProperty(target, name, {
    enumerable: !0,
    get: all[name]
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
