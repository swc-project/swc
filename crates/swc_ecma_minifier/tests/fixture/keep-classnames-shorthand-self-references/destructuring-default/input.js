(() => {
    class Foo {
        static {
            try {
                ({ Foo = null } = {});
            } catch (error) {
                console.log(error instanceof TypeError);
            }
        }
    }
    console.log(Foo.name);
})();
