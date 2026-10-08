enum Outer {
    A = 1,
}

function read() {
    const enum Local {
        A = 11,
    }
    namespace Values {
        export const enum Inner {
            A = 17,
        }
        import Alias = Inner;
        export function object() {
            return Alias;
        }
    }
    return [Outer.A, Local, Values.object()];
}

export const result = read();
