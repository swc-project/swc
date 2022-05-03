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
let _s = s, _s1 = s;
export class ClassWithPrivateNamedMethods {
    [_s]() {}
    static [_s1]() {}
}
let _s2 = s, _s3 = s, _s4 = s, _s5 = s;
export class ClassWithPrivateNamedAccessors {
    get [_s2]() {
        return undefined;
    }
    set [_s3](v) {}
    static get [_s4]() {
        return undefined;
    }
    static set [_s5](v) {}
}
