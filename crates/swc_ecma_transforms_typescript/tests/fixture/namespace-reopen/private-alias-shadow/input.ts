namespace O {
    export const o = 1;
}
namespace Outer {
    export import Inner = O;
    namespace Inner {
        export const a = 1;
    }
}
const a = 2;
namespace Outer {
    namespace Inner {
        export const b = a;
    }
}
