namespace Outer {
    export interface Inner {}
    export namespace Inner {
        export const a = 1;
    }
}

namespace Outer {
    export interface Inner {}
    export namespace Inner {
        export const b = a;
    }
}
