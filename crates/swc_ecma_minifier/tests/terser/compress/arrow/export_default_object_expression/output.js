"module evaluation";
const default_export = {
    foo: 3,
    bar: ()=>4,
    get baz () {
        return this.foo;
    }
};
export { default_export as default };
