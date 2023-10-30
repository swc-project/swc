var _value = /*#__PURE__*/ new WeakSet();
class Foo {
    // #value = 1;
    get(target) {
        return _class_private_method_get(target, _value, value);
    }
    constructor(){
        _class_private_method_init(this, _value);
    }
}
function value() {
    return 1;
}
