namespace Outer {
    export type U = Inner;
}

namespace Outer {
    export interface Inner {}
    export namespace Inner {
        export const a = 1;
    }
}
