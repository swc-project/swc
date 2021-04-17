const obj = {
    foo: 5,
    async method() {
        return this.foo;
    }
}


console.log(obj.method())