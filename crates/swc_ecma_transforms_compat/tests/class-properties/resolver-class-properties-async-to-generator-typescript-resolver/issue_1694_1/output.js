var _get = /*#__PURE__*/ new WeakSet();
class MyClass {
    constructor(){
        _class_private_method_init(this, _get);
        _class_private_method_get(this, _get, get).call(this, foo);
    }
}
function get() {
    return 1;
}
