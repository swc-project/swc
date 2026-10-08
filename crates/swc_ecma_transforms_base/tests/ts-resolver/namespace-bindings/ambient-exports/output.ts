import * as remote__2 from "pkg";
const x__2 = 7;
const hidden__2 = 8;
const value__2 = 9;
declare namespace N__2 {
    import source__3 = remote__2.value;
    export { source__3 as x__2 };
}
namespace N__2 {
    export function f__4() {
        return x__3;
    }
}
declare namespace Other__2 {
    const hidden__6: number;
    export type { hidden__6 as x__2 };
}
namespace Other__2 {
    export function f__7() {
        return x__2 + hidden__2;
    }
}
namespace TypeSource__2 {
    export interface T__9 {
    }
}
namespace Fallback__2 {
    export import value__10 = TypeSource__2.T;
    export function f__10() {
        return value__2;
    }
}
