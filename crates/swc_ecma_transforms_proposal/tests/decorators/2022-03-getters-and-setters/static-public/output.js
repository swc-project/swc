var _computedKey, _computedKey1, _initStatic;
const dec = ()=>{};
_computedKey = 'b', _computedKey1 = 'b';
class Foo {
    static{
        ({ e: [_initStatic]  } = _apply_decs_2203_r(this, [
            [
                dec,
                8,
                "a"
            ],
            [
                dec,
                9,
                "a"
            ],
            [
                dec,
                8,
                _computedKey
            ],
            [
                dec,
                9,
                _computedKey1
            ]
        ], []));
        _initStatic(this);
    }
    static value = 1;
    static get a() {
        return this.value;
    }
    static set a(v) {
        this.value = v;
    }
    static get [_computedKey]() {
        return this.value;
    }
    static set [_computedKey1](v) {
        this.value = v;
    }
}
