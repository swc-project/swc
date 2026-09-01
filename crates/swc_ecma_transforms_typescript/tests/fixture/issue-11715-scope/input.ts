declare const ambient: string;

const outer = "outer";

enum Ambient {
    A = ambient,
    B = "b",
}

function inFunction() {
    const inner = "inner";
    enum Local {
        A = inner,
        B = "b",
    }
    return Local;
}

namespace NS {
    const scoped = "scoped";
    export enum InNamespace {
        A = scoped,
        B = "b",
    }
}

enum ShadowedOuter {
    A = outer,
    B = "b",
}
