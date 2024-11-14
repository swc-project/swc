var _computedKey, _computedKey1, _initProto;
const dec = ()=>{};
_computedKey = getKey(), _computedKey1 = getKey();
let _computedKey2 = _computedKey, _computedKey3 = _computedKey1;
class Foo {
    [_computedKey2]() {
        return 1;
    }
    [_computedKey3]() {
        return 2;
    }
    constructor(){
        _initProto(this);
    }
}
({ e: [_initProto] } = _apply_decs_2203_r(Foo, [
    [
        dec,
        2,
        _computedKey
    ],
    [
        dec,
        2,
        _computedKey1
    ]
], []));
