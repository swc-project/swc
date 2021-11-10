export default {
    foo: 3,
    bar: () => 4,
    get baz() {
        return this.foo;
    },
};
