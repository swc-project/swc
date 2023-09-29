namespace Foo {
    export let { a = 1 } = {};
    export const { b = 2 } = {};
    export const [c = 3, { d = 4 } = {}] = [];

    console.log("inner", a, b, c, d);
}

console.log("outer", Foo.a, Foo.b, Foo.c, Foo.d);
