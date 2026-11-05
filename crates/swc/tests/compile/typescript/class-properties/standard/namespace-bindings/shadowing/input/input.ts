const privateValue = 100;
const T = 5;
namespace N {
    const privateValue = 10;
    export const x = 1;
    export interface T { value: number; }
    export function first() { return privateValue; }
}
namespace N {
    export const outside = privateValue + T;
    export function parameter(x: number) { return x; }
    export function local() {
        const x = 20;
        return x;
    }
    export function shared() { return x; }
}
console.log(N.first(), N.outside, N.parameter(30), N.local(), N.shared());
