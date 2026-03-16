var _init_a, _init_extra__init_a, _init_b, _init_extra__init_b, _computedKey, _init_computedKey, _init_extra__init_computedKey, _initProto;
const dec = ()=>{};
_computedKey = 'c';
var ____private_a_1 = /*#__PURE__*/ new WeakMap(), ____private_b_2 = /*#__PURE__*/ new WeakMap(), ____private_computedKey_3 = /*#__PURE__*/ new WeakMap();
let _computedKey1 = _computedKey, _computedKey2 = _computedKey;
class Foo {
    get a() {
        return _class_private_field_get(this, ____private_a_1);
    }
    set a(_v) {
        _class_private_field_set(this, ____private_a_1, _v);
    }
    get b() {
        return _class_private_field_get(this, ____private_b_2);
    }
    set b(_v) {
        _class_private_field_set(this, ____private_b_2, _v);
    }
    get [_computedKey1]() {
        return _class_private_field_get(this, ____private_computedKey_3);
    }
    set [_computedKey2](_v) {
        _class_private_field_set(this, ____private_computedKey_3, _v);
    }
    constructor(){
        _class_private_field_init(this, ____private_a_1, {
            writable: true,
            value: (_initProto(this), (()=>{
                const _value = _init_a(this);
                _init_extra__init_a(this);
                return _value;
            })())
        });
        _class_private_field_init(this, ____private_b_2, {
            writable: true,
            value: (()=>{
                const _value = _init_b(this, 123);
                _init_extra__init_b(this);
                return _value;
            })()
        });
        _class_private_field_init(this, ____private_computedKey_3, {
            writable: true,
            value: (()=>{
                const _value = _init_computedKey(this, 456);
                _init_extra__init_computedKey(this);
                return _value;
            })()
        });
    }
}
({ e: [_init_a, _init_extra__init_a, _init_b, _init_extra__init_b, _init_computedKey, _init_extra__init_computedKey, _initProto] } = _apply_decs_2311(Foo, [], [
    [
        dec,
        1,
        "a"
    ],
    [
        dec,
        1,
        "b"
    ],
    [
        dec,
        1,
        _computedKey
    ]
]));
