const source = 10;
const intermediate = source + 2;

const enum Literal {
    A = 3,
    B = A + 2,
}

const enum Dependent {
    A = intermediate,
    B,
}

namespace Values {
    export const value = 17;
}

const enum Qualified {
    A = Values.value,
}

function deferred() {
    const local = 19;
    const enum Local {
        A = local,
    }
    return Local.A;
}

export const results = [Literal.B, Dependent.A, Dependent.B, Qualified.A, deferred()];
