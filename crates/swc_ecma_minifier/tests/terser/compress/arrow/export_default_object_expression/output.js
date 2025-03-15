export default {
    foo: 1 + 2,
    bar: ()=>4,
    get baz () {
        return this.foo;
    }
};
