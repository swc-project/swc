function outer() {
    function _class_call_check(e, t) {
        if (!(e instanceof t)) throw new TypeError("bad");
    }

    function _instanceof(e) {
        return new ZodCustom(e);
    }

    eval("");

    var Foo = function Foo() {
        _class_call_check(this, Foo);
    };

    new Foo();

    var ZodCustom = function ZodCustom(v) {
        this.v = v;
    };
}

outer();
