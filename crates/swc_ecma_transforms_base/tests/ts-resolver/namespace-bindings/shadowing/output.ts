const privateValue__2 = 100;
const T__2 = 5;
namespace N__2 {
    const privateValue__3 = 10;
    export const x__3 = 1;
    export interface T__3 {
        value__0: number;
    }
    export function first__3() {
        return privateValue__3;
    }
}
namespace N__2 {
    export const outside__5 = privateValue__2 + T__2;
    export function parameter__5(x__6: number) {
        return x__6;
    }
    export function local__5() {
        const x__7 = 20;
        return x__7;
    }
    export function shared__5() {
        return x__3;
    }
}
console.log(N__2.first(), N__2.outside, N__2.parameter(30), N__2.local(), N__2.shared());
