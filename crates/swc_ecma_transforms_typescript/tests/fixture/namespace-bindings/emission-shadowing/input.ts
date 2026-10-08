const value = 43;

namespace Outer {
    export const value = 5;
    export function shadow(value: number) {
        return value;
    }
    export namespace Child {
        export const value = 7;
        export function nested(value: number) {
            return value + Outer.value;
        }
    }
}

namespace Outer {
    export const merged = value;
}

export const result = [value, Outer.shadow(11), Outer.Child.nested(13), Outer.merged];
