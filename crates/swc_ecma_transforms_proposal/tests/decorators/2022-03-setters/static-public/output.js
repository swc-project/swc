var _computedKey, _initStatic;
const dec = ()=>{};
_computedKey = 'b';
class Foo {
    static{
        ({ e: [_initStatic]  } = _apply_decs_2203_r(this, [
            [
                dec,
                9,
                "a"
            ],
            [
                dec,
                9,
                _computedKey
            ]
        ], []));
        _initStatic(this);
    }
    static value = 1;
    static set a(v) {
        return this.value = v;
    }
    static set [_computedKey](v) {
        return this.value = v;
    }
}
