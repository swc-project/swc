const obj = {
    foo: 5,
    async method() {
        return this.foo;
    },
};

obj.method().then((v) => console.log(v));
