namespace Test {
    export function abc() {
        return 10;
    }

    export const foo = function () {
        return 20;
    };

    export function xyz() {
        return abc() * foo();
    }
}

Test.xyz();
