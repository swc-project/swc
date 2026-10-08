let calls = 0;
function effect(value: number) {
    calls++;
    return value + 1;
}

namespace Closed.Child {
    export const enum Source {
        A = 9,
    }
}

const enum Dynamic {
    A = Closed.Child.Source.A,
    B = effect(Closed.Child.Source.A),
    C = B + Closed.Child.Source.A,
}

const enum Writable {
    A = 13,
}
Writable.A++;

expect([Closed.Child.Source.A, Dynamic.A, Dynamic.B, Dynamic.C, Reflect.get(Writable, "A")]).toEqual([9, 9, 10, 19, 14]);
expect(calls).toBe(1);
