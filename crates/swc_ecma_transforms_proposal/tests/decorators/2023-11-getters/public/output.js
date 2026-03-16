let _computedKey, _initProto;
const dec = ()=>{};
_computedKey = _to_property_key('b');
class Foo {
    static{
        ({ e: [_initProto] } = _apply_decs_2311(this, [], [
            [
                dec,
                3,
                "a"
            ],
            [
                dec,
                3,
                _computedKey
            ]
        ]));
    }
    value = (_initProto(this), 1);
    get a() {
        return this.value;
    }
    get [_computedKey]() {
        return this.value;
    }
}
