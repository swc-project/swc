function noopFactory() {
    return function noop(x) {
        return x;
    };
}
{
    var _computedKey, _dec, _init_p, _initProto;
    _computedKey = "a1", "a2" as any, _dec = noopFactory(0);
    class C {
        static{
            ({ e: [_init_p, _initProto] } = _apply_decs_2311(this, [], [
                [
                    _dec,
                    0,
                    "p",
                    function() {
                        return this.#p;
                    },
                    function(value) {
                        this.#p = value;
                    }
                ]
            ], 0, (o)=>#p in o));
        }
        [_computedKey]() {}
        #p = (_initProto(this), _init_p(this));
    }
    expect(new C()).toHaveProperty("a2");
}{
    var _computedKey1, _dec1, _init_p1, _initProto1;
    _computedKey1 = "a1", "b2" as any, _dec1 = noopFactory(1);
    class C {
        static{
            ({ e: [_init_p1, _initProto1] } = _apply_decs_2311(this, [], [
                [
                    _dec1,
                    0,
                    "p",
                    function() {
                        return this.#p;
                    },
                    function(value) {
                        this.#p = value;
                    }
                ]
            ], 0, (o)=>#p in o));
        }
        [_computedKey1]() {}
        #p = (_initProto1(this), _init_p1(this));
    }
    expect(new C()).toHaveProperty("b2");
}
