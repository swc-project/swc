namespace N {
    export namespace M {
        export const x = 1;
    }
}
namespace N {
    export namespace M {
        export const y = x + 1;
    }
    import Inner = M;
    export const result = Inner.y;
}
namespace N.M {
    export function get() { return y; }
}
console.log(N.result, N.M.get());
