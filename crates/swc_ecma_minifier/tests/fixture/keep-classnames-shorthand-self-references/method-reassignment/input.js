(() => {
    class Foo {
        getSelf() {
            return { Foo };
        }
        getShadowed(Foo) {
            return { Foo };
        }
    }
    const Saved = Foo;
    Foo = null;
    const instance = new Saved();
    console.log(Saved.name, instance.getSelf().Foo === Saved);
    console.log(instance.getShadowed(7).Foo);
})();
