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
export function funcInferredReturnType(obj) {
    return obj;
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
var tmp3 = s, tmp4 = s, tmp5 = s, tmp6 = s;
export class ClassWithPrivateNamedAccessors {
    get [tmp3]() {
        return undefined;
    }
    set [tmp4](v) {
    }
    static get [tmp5]() {
        return undefined;
    }
    static set [tmp6](v) {
    }
}
