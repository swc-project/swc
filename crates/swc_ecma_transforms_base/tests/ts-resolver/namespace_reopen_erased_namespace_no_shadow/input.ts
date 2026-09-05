var C = "outer";
namespace N {
    export const x = C;
}
namespace N {
    export namespace C {
        export interface I {}
    }
}
var D = "outer";
namespace M {
    export namespace D {}
}
namespace M {
    export const y = D;
}
