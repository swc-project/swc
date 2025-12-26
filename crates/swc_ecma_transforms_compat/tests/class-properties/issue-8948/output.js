var _switch = new WeakSet(), _bar = new WeakSet();
class TestCls {
    foo() {
        bar.call(this);
        __switch.call(this);
    }
    constructor(){
        _switch.add(this);
        _bar.add(this);
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
