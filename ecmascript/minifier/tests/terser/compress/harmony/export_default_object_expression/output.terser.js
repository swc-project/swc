export default {
    foo: 3,
    bar() {
        return 4;
    },
    get baz() {
        return this.foo;
    },
};
