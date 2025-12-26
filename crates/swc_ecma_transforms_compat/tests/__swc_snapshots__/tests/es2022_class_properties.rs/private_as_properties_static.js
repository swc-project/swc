var _f = new WeakMap(), _bar = new WeakMap();
class Cl {
}
function foo() {}
function get_bar() {}
_bar.set(Cl, {
    get: get_bar,
    set: void 0
});
_f.set(Cl, {
    writable: true,
    value: 123
});
