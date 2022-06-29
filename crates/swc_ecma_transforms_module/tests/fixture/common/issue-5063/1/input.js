export class Foo {
    bar = 5;
    getThing(a, b = this.bar) {
        return a + b;
    }

    static baz = 6;
    static foo(a, b = this.baz) {
        return a + b;
    }
}

export function foo(a = this) {
    console.log(a);
}

export const bar = {
    [this]: foo,
    bar(x = this) {},
};

export default {
    [this]() {
        return this;
    },
};
