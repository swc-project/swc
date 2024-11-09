var _init_a, _init_b;
const dec = ()=>{};
var _a = /*#__PURE__*/ new WeakMap(), _b = /*#__PURE__*/ new WeakMap();
class Foo {
    constructor(){
        _class_private_field_init(this, _a, {
            writable: true,
            value: _init_a(this)
        });
        _class_private_field_init(this, _b, {
            writable: true,
            value: _init_b(this, 123)
        });
    }
}
({ e: [_init_a, _init_b] } = _apply_decs_2203_r(Foo, [
    [
        dec,
        0,
        "a",
        function() {
            return _class_private_field_get(this, _a);
        },
        function(value) {
            _class_private_field_set(this, _a, value);
        }
    ],
    [
        dec,
        0,
        "b",
        function() {
            return _class_private_field_get(this, _b);
        },
        function(value) {
            _class_private_field_set(this, _b, value);
        }
    ]
], []));
