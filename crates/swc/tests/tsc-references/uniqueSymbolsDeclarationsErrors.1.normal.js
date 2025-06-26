//// [uniqueSymbolsDeclarationsErrors.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
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
