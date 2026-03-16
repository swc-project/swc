let _computedKey, _computedKey1, _initProto;
const dec = ()=>{};
_computedKey = _to_property_key(getKeyI()), _computedKey1 = _to_property_key(getKeyJ());
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
({ e: [_initProto] } = _apply_decs_2311(Foo, [], [
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
]));
