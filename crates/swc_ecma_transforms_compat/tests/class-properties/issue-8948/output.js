var _switch = /*#__PURE__*/ new WeakSet(), _bar = /*#__PURE__*/ new WeakSet();
class TestCls {
    foo() {
        _class_private_method_get(this, _bar, bar).call(this);
        _class_private_method_get(this, _switch, __switch).call(this);
    }
    constructor(){
        _class_private_method_init(this, _switch);
        _class_private_method_init(this, _bar);
    }
}
function __switch() {
    console.log("#switch called");
}
function bar() {
    console.log("#bar called");
}
let a = new TestCls();
a.foo();
