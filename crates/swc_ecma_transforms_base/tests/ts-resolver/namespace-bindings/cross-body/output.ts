namespace N__2 {
    export function f__3() {
        return value__6;
    }
    export class C__3 {
        get() {
            return value__6;
        }
    }
    f__3();
}
namespace N__2 {
    export const value__6 = 1;
    export const result__6 = f__3() + new C__3().get();
}
console.log(N__2.result);
