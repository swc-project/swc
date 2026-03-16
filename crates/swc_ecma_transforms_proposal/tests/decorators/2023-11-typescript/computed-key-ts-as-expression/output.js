function noopFactory() {
    return function noop(x) {
        return x;
    };
}
{
    var _computedKey, _dec, _init_p, _init_extra_p;
    _computedKey = ("a1", "a2"), _dec = noopFactory(0);
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
        [_computedKey]() {}
        #p = (()=>{
            const _value = _init_p(this);
            _init_extra_p(this);
            return _value;
        })();
    }
    expect(new C()).toHaveProperty("a2");
}{
    var _computedKey1, _dec1, _init_p1, _init_extra_p1;
    _computedKey1 = ("a1", "b2"), _dec1 = noopFactory(1);
    class C {
        static{
            ({ e: [_init_p1, _init_extra_p1] } = _apply_decs_2311(this, [], [
                [
                    _dec1,
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
        [_computedKey1]() {}
        #p = (()=>{
            const _value = _init_p1(this);
            _init_extra_p1(this);
            return _value;
        })();
    }
    expect(new C()).toHaveProperty("b2");
}
