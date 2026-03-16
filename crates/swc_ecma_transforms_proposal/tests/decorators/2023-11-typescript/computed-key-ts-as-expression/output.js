function noopFactory() {
    return function noop(x) {
        return x;
    };
}
{
    let _computedKey, _dec, _init_p, _init_extra_p;
    _computedKey = _to_property_key(("a1", "a2")), _dec = noopFactory(0);
    class C {
        static{
            ({ e: [_init_p, _init_extra_p] } = _apply_decs_2311(this, [], [
                [
                    _dec,
                    0,
                    "p",
                    function(_this) {
                        return _this.#p;
                    },
                    function(_this, value) {
                        _this.#p = value;
                    }
                ]
            ], 0, (o)=>#p in o));
        }
        constructor(){
            _init_extra_p(this);
        }
        [_computedKey]() {}
        #p = _init_p(this);
    }
    expect(new C()).toHaveProperty("a2");
}{
    let _computedKey, _dec, _init_p, _init_extra_p;
    _computedKey = _to_property_key(("a1", "b2")), _dec = noopFactory(1);
    class C {
        static{
            ({ e: [_init_p, _init_extra_p] } = _apply_decs_2311(this, [], [
                [
                    _dec,
                    0,
                    "p",
                    function(_this) {
                        return _this.#p;
                    },
                    function(_this, value) {
                        _this.#p = value;
                    }
                ]
            ], 0, (o)=>#p in o));
        }
        constructor(){
            _init_extra_p(this);
        }
        [_computedKey]() {}
        #p = _init_p(this);
    }
    expect(new C()).toHaveProperty("b2");
}
