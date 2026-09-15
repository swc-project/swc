var C = "outer";
namespace N {
    export namespace C {
        export interface I {}
    }
}
namespace N {
    export const x = C;
}
var D = "outer";
namespace M {
    export const y = D;
}
namespace M {
    export namespace D {}
}
