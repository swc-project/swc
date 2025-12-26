var _a = new WeakMap(), _b = new WeakMap();
class MyClass {
    constructor(){
        _a.set(this, {
            get: get_a,
            set: set_a
        });
    }
}
function get_a() {}
function set_a(x) {}
function get_b() {}
function set_b(x) {}
_b.set(MyClass, {
    get: get_b,
    set: set_b
});
