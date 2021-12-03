// not allowed when emitting declarations
export const obj = {
    method1 (p) {
        return p;
    },
    method2 (p) {
        return p;
    }
};
export const classExpression = class _class {
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
var tmp = s, tmp1 = s;
export class ClassWithPrivateNamedMethods {
    [tmp]() {
    }
    static [tmp1]() {
    }
}
var tmp2 = s, tmp3 = s, tmp4 = s, tmp5 = s;
export class ClassWithPrivateNamedAccessors {
    get [tmp2]() {
        return undefined;
    }
    set [tmp3](v) {
    }
    static get [tmp4]() {
        return undefined;
    }
    static set [tmp5](v) {
    }
}
