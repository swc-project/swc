namespace N {
    export const x = C;
}
namespace N {
    export namespace C {
        export const a = 1;
    }
}
namespace N {
    export const y = C;
}
const C = "outer";
