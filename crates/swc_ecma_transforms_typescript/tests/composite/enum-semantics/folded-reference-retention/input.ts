import { effect, unused } from "values";

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

export const result = [Closed.Child.Source.A, Dynamic.A, Dynamic.B, Dynamic.C, Writable.A];
