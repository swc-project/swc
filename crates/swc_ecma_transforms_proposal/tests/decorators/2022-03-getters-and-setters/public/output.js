var _computedKey, _computedKey1, _initProto;
const dec = ()=>{};
_computedKey = 'b', _computedKey1 = 'b';
class Foo {
    static{
        ({ e: [_initProto] } = _apply_decs_2203_r(this, [
            [
                dec,
                3,
                "a"
            ],
            [
                dec,
                4,
                "a"
            ],
            [
                dec,
                3,
                _computedKey
            ],
            [
                dec,
                4,
                _computedKey1
            ]
        ], []));
    }
    value = (_initProto(this), 1);
    get a() {
        return this.value;
    }
    set a(v) {
        this.value = v;
    }
    get [_computedKey]() {
        return this.value;
    }
    set [_computedKey1](v) {
        this.value = v;
    }
}
