var _computedKey, _initProto;
const dec = ()=>{};
_computedKey = 'b';
let _computedKey1 = _computedKey;
class Foo {
    get a() {
        return this.value;
    }
    get [_computedKey1]() {
        return this.value;
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
        3,
        _computedKey
    ]
], []));
