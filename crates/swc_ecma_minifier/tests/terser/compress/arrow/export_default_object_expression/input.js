export default {
    foo: 1 + 2,
    bar() {
        return 4;
    },
    get baz() {
        return this.foo;
    },
};
