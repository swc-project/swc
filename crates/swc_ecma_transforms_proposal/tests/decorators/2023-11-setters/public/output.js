let _computedKey, _initProto;
const dec = ()=>{};
_computedKey = _to_property_key('b');
class Foo {
    static{
        ({ e: [_initProto] } = _apply_decs_2311(this, [], [
            [
                dec,
                4,
                "a"
            ],
            [
                dec,
                4,
                _computedKey
            ]
        ]));
    }
    value = (_initProto(this), 1);
    set a(v) {
        return this.value = v;
    }
    set [_computedKey](v) {
        return this.value = v;
    }
}
