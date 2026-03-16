var _init_a, _init_extra_a, _init_b, _init_extra_b, _initProto;
const dec = ()=>{};
var _a = /*#__PURE__*/ new WeakMap(), _b = /*#__PURE__*/ new WeakMap();
class Foo {
    constructor(){
        _class_private_field_init(this, _a, {
            writable: true,
            value: (_initProto(this), (()=>{
                const _value = _init_a(this);
                _init_extra_a(this);
                return _value;
            })())
        });
        _class_private_field_init(this, _b, {
            writable: true,
            value: (()=>{
                const _value = _init_b(this, 123);
                _init_extra_b(this);
                return _value;
            })()
        });
    }
}
({ e: [_init_a, _init_extra_a, _init_b, _init_extra_b, _initProto] } = _apply_decs_2311(Foo, [], [
    [
        dec,
        0,
        "a",
        function(_this) {
            return _class_private_field_get(_this, _a);
        },
        function(_this, value) {
            _class_private_field_set(_this, _a, value);
        }
    ],
    [
        dec,
        0,
        "b",
        function(_this) {
            return _class_private_field_get(_this, _b);
        },
        function(_this, value) {
            _class_private_field_set(_this, _b, value);
        }
    ]
], 0, (o)=>_a.has(o)));
