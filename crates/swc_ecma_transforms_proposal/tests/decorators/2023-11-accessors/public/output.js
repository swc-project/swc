var _init_a, _init_extra__init_a, _init_b, _init_extra__init_b, _computedKey, _init_computedKey, _init_extra__init_computedKey, _initProto;
const dec = ()=>{};
_computedKey = 'c';
class Foo {
    static{
        ({ e: [_init_a, _init_extra__init_a, _init_b, _init_extra__init_b, _init_computedKey, _init_extra__init_computedKey, _initProto] } = _apply_decs_2311(this, [], [
            [
                dec,
                1,
                "a"
            ],
            [
                dec,
                1,
                "b"
            ],
            [
                dec,
                1,
                _computedKey
            ]
        ]));
    }
    #___private_a_1 = (_initProto(this), (()=>{
        const _value = _init_a(this);
        _init_extra__init_a(this);
        return _value;
    })());
    get a() {
        return this.#___private_a_1;
    }
    set a(_v) {
        this.#___private_a_1 = _v;
    }
    #___private_b_2 = (()=>{
        const _value = _init_b(this, 123);
        _init_extra__init_b(this);
        return _value;
    })();
    get b() {
        return this.#___private_b_2;
    }
    set b(_v) {
        this.#___private_b_2 = _v;
    }
    #___private_computedKey_3 = (()=>{
        const _value = _init_computedKey(this, 456);
        _init_extra__init_computedKey(this);
        return _value;
    })();
    get [_computedKey]() {
        return this.#___private_computedKey_3;
    }
    set [_computedKey](_v) {
        this.#___private_computedKey_3 = _v;
    }
}
