namespace N {
    export function f() { return value; }
    export class C { get() { return value; } }
    f();
}
namespace N {
    export const value = 1;
    export const result = f() + new C().get();
}
console.log(N.result);
expect(N.result).toBe(2);
