var _a = /*#__PURE__*/ new WeakMap();
class MyClass {
    constructor(){
        _class_private_field_init(this, _a, {
            get: get_a,
            set: set_a
        });
    }
}
var _b = {
    get: get_b,
    set: set_b
};
function get_a() {}
function set_a(x) {}
function get_b() {}
function set_b(x) {}
