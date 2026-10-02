namespace Unique {
    export const value = 5;
    export function read(value: number) {
        return value;
    }
    export namespace Child {
        export const inherited = value;
        export function readOuter() {
            return value;
        }
    }
}

function left() {
    namespace Local {
        export const value = 7;
    }
    return Local.value;
}

function right() {
    namespace Local {
        export const value = 11;
    }
    return Local.value;
}

console.log(Unique.read(13), Unique.Child.inherited, Unique.Child.readOuter(), left(), right());
