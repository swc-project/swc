function runtime() { return 3; }
enum E {
    A = runtime(),
    B = E.A,
    C = A + 1,
    Deferred = (() => E.C)()
}
const result = [E.A, E.B, E.C, E.Deferred];
