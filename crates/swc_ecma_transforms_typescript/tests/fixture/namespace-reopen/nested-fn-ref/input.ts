namespace T {
    export function f() {
        return 5;
    }
    export namespace Sub {
        export const v = f();
    }
}
