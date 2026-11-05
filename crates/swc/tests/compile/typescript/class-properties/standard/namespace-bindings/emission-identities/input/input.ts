const value = 100;

namespace First {
    export const value = 1;
    export class Box {
        get() { return value; }
    }
    export function read(value: number) {
        return value + First.value;
    }
    export const object = { value };
    export namespace Child {
        export const value = 3;
        export const total = value + First.value;
        export function read(value: number) { return value + First.value; }
    }
}

namespace Second {
    export const value = 2;
    export class Box {
        get() { return value; }
    }
    export const object = { value };
}

namespace First {
    export interface value { typeOnly: true }
}

namespace First {
    export const previous = value + new Box().get();
    export const fromChild = Child.total;
}

function read(value: number) {
    return value + First.value + Second.value;
}
const object = { value };

console.log(value, read(4), First.read(5), First.previous, First.fromChild,
    First.object.value, Second.object.value, new Second.Box().get(),
    First.Child.read(5), object.value);
