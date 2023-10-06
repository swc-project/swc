var _init_a, _init_b, _computedKey, _init_computedKey, _initProto;
const dec = ()=>{};
_computedKey = 'c';
var ____private_a = /*#__PURE__*/ new WeakMap(), ____private_b = /*#__PURE__*/ new WeakMap(), ____private_computedKey = /*#__PURE__*/ new WeakMap();
let _computedKey1 = _computedKey, _computedKey2 = _computedKey;
class Foo {
    get a() {
        return _class_private_field_get(this, ____private_a);
    }
    set a(_v) {
        _class_private_field_set(this, ____private_a, _v);
    }
    get b() {
        return _class_private_field_get(this, ____private_b);
    }
    set b(_v) {
        _class_private_field_set(this, ____private_b, _v);
    }
    get [_computedKey1]() {
        return _class_private_field_get(this, ____private_computedKey);
    }
    set [_computedKey2](_v) {
        _class_private_field_set(this, ____private_computedKey, _v);
    }
    constructor(){
        _class_private_field_init(this, ____private_a, {
            writable: true,
            value: (_initProto(this), _init_a(this))
        });
        _class_private_field_init(this, ____private_b, {
            writable: true,
            value: _init_b(this, 123)
        });
        _class_private_field_init(this, ____private_computedKey, {
            writable: true,
            value: _init_computedKey(this, 456)
        });
    }
}
var __ = {
    writable: true,
    value: { e: [_init_a, _init_b, _init_computedKey, _initProto] } = _apply_decs_2203_r(Foo, [
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
    ], [])
};
