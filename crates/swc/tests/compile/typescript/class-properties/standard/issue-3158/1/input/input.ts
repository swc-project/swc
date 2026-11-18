namespace Foo {
    export const bar = 42;

    export const foo = function () {
        return 20;
    };

    export function xyz() {
        return foo() * bar;
    }
}
