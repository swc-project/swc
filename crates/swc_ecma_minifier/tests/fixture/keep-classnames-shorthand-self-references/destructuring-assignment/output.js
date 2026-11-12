(()=>{
    let o = class Foo {
        static assign(r) {
            try {
                ({ Foo } = r);
            } catch (o) {
                return o instanceof TypeError;
            }
            return !1;
        }
    };
    console.log(o.assign({
        Foo: null
    })), console.log(o.name);
})();
