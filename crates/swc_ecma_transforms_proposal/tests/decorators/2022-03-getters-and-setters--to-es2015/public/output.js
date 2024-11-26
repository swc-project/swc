var _computedKey, _computedKey1, _initProto;
const dec = ()=>{};
_computedKey = 'b', _computedKey1 = 'b';
let _computedKey2 = _computedKey, _computedKey3 = _computedKey1;
class Foo {
    get a() {
        return this.value;
    }
    set a(v) {
        this.value = v;
    }
    get [_computedKey2]() {
        return this.value;
    }
    set [_computedKey3](v) {
        this.value = v;
    }
    constructor(){
        _define_property(this, "value", (_initProto(this), 1));
    }
}
({ e: [_initProto] } = _apply_decs_2203_r(Foo, [
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
