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
        export function value() {
            return Reflect.get(Alias, "A");
        }
    }
    return [Outer.A, Local.A, Reflect.get(Local, "A"), Values.value()];
}

expect(read()).toEqual([1, 11, 11, 17]);
