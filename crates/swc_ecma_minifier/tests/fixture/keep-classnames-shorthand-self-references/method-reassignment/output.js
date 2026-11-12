(()=>{
    let e = class Foo {
        getSelf() {
            return {
                Foo
            };
        }
        getShadowed(e) {
            return {
                Foo: e
            };
        }
    };
    let o = e;
    e = null;
    let l = new o();
    console.log(o.name, l.getSelf().Foo === o), console.log(l.getShadowed(7).Foo);
})();
