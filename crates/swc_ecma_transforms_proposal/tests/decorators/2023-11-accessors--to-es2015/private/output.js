var _init_a, _init_extra__init_a, _get___a, _set___a, _init_b, _init_extra__init_b, _get___b, _set___b, _initProto;
const dec = ()=>{};
var ___a_1 = /*#__PURE__*/ new WeakMap(), _a = /*#__PURE__*/ new WeakMap(), ___b_2 = /*#__PURE__*/ new WeakMap(), _b = /*#__PURE__*/ new WeakMap();
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
        _class_private_field_init(this, ___a_1, {
            writable: true,
            value: (_initProto(this), (()=>{
                const _value = _init_a(this);
                _init_extra__init_a(this);
                return _value;
            })())
        });
        _class_private_field_init(this, ___b_2, {
            writable: true,
            value: (()=>{
                const _value = _init_b(this, 123);
                _init_extra__init_b(this);
                return _value;
            })()
        });
    }
}
({ e: [_init_a, _get___a, _set___a, _init_extra__init_a, _init_b, _get___b, _set___b, _init_extra__init_b, _initProto] } = _apply_decs_2311(Foo, [], [
    [
        dec,
        1,
        "a",
        function(_this) {
            return _class_private_field_get(_this, ___a_1);
        },
        function(_this, _v) {
            _class_private_field_set(_this, ___a_1, _v);
        }
    ],
    [
        dec,
        1,
        "b",
        function(_this) {
            return _class_private_field_get(_this, ___b_2);
        },
        function(_this, _v) {
            _class_private_field_set(_this, ___b_2, _v);
        }
    ]
], 0, (o)=>_a.has(o)));
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
