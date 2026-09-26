var C = "outer";
namespace N {
    export const x = C;
}
namespace N {
    export namespace C {
        export declare function f(): void;
    }
}
var D = "outer";
namespace M {
    export const y = D;
}
namespace M {
    export declare namespace D {
        function g(): void;
    }
}
