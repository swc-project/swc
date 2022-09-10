class Foo {
    constructor(v) {
        this.value = v;
    }

    static klass = class {
        constructor(v) {
            this.value = v;
        }
    };
}

(async () => {
    class Bar extends Foo {
        async bar() {
            const foo = new Foo(await Promise.resolve(1));
            const foo2 = new Foo.klass(await Promise.resolve(2));

            console.log(foo.value);
            console.log(foo2.value);
        }
    }

    await new Bar().bar();
})();
