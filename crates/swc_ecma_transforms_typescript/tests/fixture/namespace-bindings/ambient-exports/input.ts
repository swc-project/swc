import * as remote from "pkg";
const x = 7;
const hidden = 8;
const value = 9;
declare namespace N {
    import source = remote.value;
    export { source as x };
}
namespace N {
    export function f() { return x; }
}
declare namespace Types {
    enum Local { A = 42 }
    export { Local as Public };
}
enum E { A = Types.Public.A, B }
declare namespace Other {
    const hidden: number;
    export type { hidden as x };
}
namespace Other {
    export function f() { return x + hidden; }
}
namespace TypeSource { export interface T {} }
namespace Fallback {
    export import value = TypeSource.T;
    export function f() { return value; }
}
