var _init_a, _init_b, _init_computedKey, _initProto;
const dec = ()=>{};
var __private_a_1 = /*#__PURE__*/ new WeakMap(), __private_b_2 = /*#__PURE__*/ new WeakMap(), __private_computedKey_3 = /*#__PURE__*/ new WeakMap();
class Foo {
    get a() {
        return _class_private_field_get(this, __private_a_1);
    }
    set a(_v) {
        _class_private_field_set(this, __private_a_1, _v);
    }
    get b() {
        return _class_private_field_get(this, __private_b_2);
    }
    set b(_v) {
        _class_private_field_set(this, __private_b_2, _v);
    }
    get ['c']() {
        return _class_private_field_get(this, __private_computedKey_3);
    }
    set ['c'](_v) {
        _class_private_field_set(this, __private_computedKey_3, _v);
    }
    constructor(){
        _class_private_field_init(this, __private_a_1, {
            writable: true,
            value: (_initProto(this), _init_a(this))
        });
        _class_private_field_init(this, __private_b_2, {
            writable: true,
            value: _init_b(this, 123)
        });
        _class_private_field_init(this, __private_computedKey_3, {
            writable: true,
            value: _init_computedKey(this, 456)
        });
    }
}
({ e: [_init_a, _init_b, _init_computedKey, _initProto] } = _apply_decs_2203_r(Foo, [
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
], []));
var __ = {
    writable: true,
    value: [_init_a, _init_b, _init_computedKey, _initProto] = _apply_decs_2203_r(Foo, [
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
            'c'
        ]
    ], []).e
};
