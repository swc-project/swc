namespace T {
    export function f() {
        return 10;
    }
}
namespace T {
    export function g() {
        return f();
    }
    export class K {
        v = 2;
    }
    export const k = new K().v;
    export const h = g() * k;
}
