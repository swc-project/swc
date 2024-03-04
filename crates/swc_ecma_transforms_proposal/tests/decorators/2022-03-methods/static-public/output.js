var _computedKey, _initStatic;
const dec = ()=>{};
class Foo {
    static{
        _computedKey = 'b';
        ({ e: [_initStatic] } = _apply_decs_2203_r(this, [
            [
                dec,
                7,
                "a"
            ],
            [
                dec,
                7,
                _computedKey
            ]
        ], []));
        _initStatic(this);
    }
    static value = 1;
    static a() {
        return this.value;
    }
    static [_computedKey]() {
        return this.value;
    }
}
