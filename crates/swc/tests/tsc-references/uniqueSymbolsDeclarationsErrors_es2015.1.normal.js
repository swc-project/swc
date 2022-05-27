// not allowed when emitting declarations
export const obj = {
    method1 (p) {
        return p;
    },
    method2 (p) {
        return p;
    }
};
export const classExpression = class {
    method1(p) {
        return p;
    }
    method2(p) {
        return p;
    }
};
export function funcInferredReturnType(obj1) {
    return obj1;
}
export class ClassWithPrivateNamedProperties {
}
export class ClassWithPrivateNamedMethods {
    [s]() {}
    static [s]() {}
}
export class ClassWithPrivateNamedAccessors {
    get [s]() {
        return undefined;
    }
    set [s](v) {}
    static get [s]() {
        return undefined;
    }
    static set [s](v) {}
}
