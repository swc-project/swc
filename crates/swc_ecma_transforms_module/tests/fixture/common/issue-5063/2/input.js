export class Foo {
    [this] = this;

    [this](a, b = this.x) {
        return a + b;
    }

    static [this] = this;
    static [this](a, b = this.x) {
        return a + b;
    }
}

export function foo(a = this) {
    console.log(a);
}

export default {
    [this]: this,

    [this](a, b = this.x) {
        return a + b;
    },

    [this]: function (a, b = this.x) {
        return a + b;
    },
};
