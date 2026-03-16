let _computedKey, _computedKey1, _initStatic;
const dec = ()=>{};
_computedKey = _to_property_key('b'), _computedKey1 = _to_property_key('b');
class Foo {
    static{
        ({ e: [_initStatic] } = _apply_decs_2311(this, [], [
            [
                dec,
                11,
                "a"
            ],
            [
                dec,
                12,
                "a"
            ],
            [
                dec,
                11,
                _computedKey
            ],
            [
                dec,
                12,
                _computedKey1
            ]
        ]));
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
