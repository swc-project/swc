(() => {
    class Foo {
        static {
            Foo.refs = { Foo };
        }
    }
    console.log(Foo.name, Foo.refs.Foo === Foo);
})();
