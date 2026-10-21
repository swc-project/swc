namespace N__2 {
    export namespace M__3 {
        export const x__4 = 1;
    }
}
namespace N__2 {
    export namespace M__5 {
        export const y__6 = x__4 + 1;
    }
    import Inner__5 = M__5;
    export const result__5 = Inner__5.y;
}
namespace N__2.M__7 {
    export function get__8() {
        return y__6;
    }
}
console.log(N__2.result, N__2.M.get());
