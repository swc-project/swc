var _init_a, _get___a, _set___a, _init_b, _get___b, _set___b, _initProto;
const dec = ()=>{};
var ___a = /*#__PURE__*/ new WeakMap(), _a = /*#__PURE__*/ new WeakMap(), ___b = /*#__PURE__*/ new WeakMap(), _b = /*#__PURE__*/ new WeakMap();
class Foo {
    constructor(){
        _class_private_field_init(this, _a, {
            get: get_a,
            set: set_a
        });
        _class_private_field_init(this, _b, {
            get: get_b,
            set: set_b
        });
        _class_private_field_init(this, ___a, {
            writable: true,
            value: (_initProto(this), _init_a(this))
        });
        _class_private_field_init(this, ___b, {
            writable: true,
            value: _init_b(this, 123)
        });
    }
}
var __ = {
    writable: true,
    value: (()=>{
        ({ e: [_init_a, _get___a, _set___a, _init_b, _get___b, _set___b, _initProto]  } = _apply_decs_2203_r(Foo, [
            [
                dec,
                1,
                "a",
                function() {
                    return _class_private_field_get(this, ___a);
                },
                function(_v) {
                    _class_private_field_set(this, ___a, _v);
                }
            ],
            [
                dec,
                1,
                "b",
                function() {
                    return _class_private_field_get(this, ___b);
                },
                function(_v) {
                    _class_private_field_set(this, ___b, _v);
                }
            ]
        ], []));
    })()
};
function get_a() {
    return _get___a(this);
}
function set_a(_v) {
    _set___a(this, _v);
}
function get_b() {
    return _get___b(this);
}
function set_b(_v) {
    _set___b(this, _v);
}
