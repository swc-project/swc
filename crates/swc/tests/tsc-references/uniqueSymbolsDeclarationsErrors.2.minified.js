//// [uniqueSymbolsDeclarationsErrors.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var target = exports, all = {
    get ClassWithPrivateNamedAccessors () {
        return ClassWithPrivateNamedAccessors;
    },
    get ClassWithPrivateNamedMethods () {
        return ClassWithPrivateNamedMethods;
    },
    get ClassWithPrivateNamedProperties () {
        return ClassWithPrivateNamedProperties;
    },
    get classExpression () {
        return classExpression;
    },
    get funcInferredReturnType () {
        return funcInferredReturnType;
    },
    get obj () {
        return obj;
    }
};
for(var name in all)Object.defineProperty(target, name, {
    enumerable: !0,
    get: Object.getOwnPropertyDescriptor(all, name).get
});
let obj = {
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
