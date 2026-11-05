const runtime = 13;

enum Literal {
    A = 7,
    B = A + 1,
}

enum Dynamic {
    A = runtime,
}

function read(runtime: number) {
    return runtime + Literal.B;
}

expect([Dynamic.A, read(3), Literal.B]).toEqual([13, 11, 8]);
