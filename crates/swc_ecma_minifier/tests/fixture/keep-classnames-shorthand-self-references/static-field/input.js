(() => {
    class Foo {
        static refs = { Foo };
    }
    console.log(Foo.name, Foo.refs.Foo === Foo);
})();
