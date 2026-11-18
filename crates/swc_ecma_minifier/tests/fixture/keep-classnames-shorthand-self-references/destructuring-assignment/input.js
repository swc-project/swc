(() => {
    class Foo {
        static assign(value) {
            try {
                ({ Foo } = value);
            } catch (error) {
                return error instanceof TypeError;
            }
            return false;
        }
    }
    console.log(Foo.assign({ Foo: null }));
    console.log(Foo.name);
})();
