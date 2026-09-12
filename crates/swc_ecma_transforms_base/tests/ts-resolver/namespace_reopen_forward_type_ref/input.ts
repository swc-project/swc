namespace COut {
    export interface I {}
}
import C = COut;
namespace N {
    export type T = C.I;
}
namespace N {
    export namespace C {
        export interface I {}
    }
}
namespace M {
    export type U = E.J;
}
namespace M {
    export namespace E {
        export interface J {}
        export const v = 1;
    }
}
namespace P {
    export namespace F {
        export interface K {}
    }
}
namespace P {
    export type W = F.K;
}
