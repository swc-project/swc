class A {
    val = '1';
    async foo() {
        try {
            return await (async (x) => x + this.val)('a');   // this is undefined
            // return await Promise.all(['a', 'b'].map(async (x) => x + this.val)); // this is undefined
        } catch (e) {
            throw e;
        }
    }
}

new A().foo();