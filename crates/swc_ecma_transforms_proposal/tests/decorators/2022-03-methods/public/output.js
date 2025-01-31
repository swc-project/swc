var _computedKey, _initProto;
const dec = ()=>{};
_computedKey = 'b';
class Foo {
    static{
        ({ e: [_initProto] } = _apply_decs_2203_r(this, [
            [
                dec,
                2,
                "a"
            ],
            [
                dec,
                2,
                _computedKey
            ]
        ], []));
    }
    value = (_initProto(this), 1);
    a() {
        return this.value;
    }
    [_computedKey]() {
        return this.value;
    }
}
