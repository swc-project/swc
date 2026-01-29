// Test multiple merged namespace declarations with cross-references
export namespace Test {
    export const a = 1;
}

export namespace Test {
    export const b = a + 1;
}

export namespace Test {
    export const c = a + b;
}

// Non-exported namespace
namespace Local {
    export const x = 10;
}

namespace Local {
    export const y = x + 1;
}
