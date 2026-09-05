namespace Outer.Inner {
    export class C {}
    export function f() {}
}

namespace Outer.Inner {
    export const c = new C();
    export const g = f();
}

namespace Outer {
    export namespace Inner {
        export const a = c;
    }
}
