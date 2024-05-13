var _switch = /*#__PURE__*/ _class_private_field_loose_key("_switch"), _bar = /*#__PURE__*/ _class_private_field_loose_key("_bar");
class TestCls {
    foo() {
        _class_private_field_loose_base(this, _bar)[_bar]();
        _class_private_field_loose_base(this, _switch)[_switch]();
    }
    constructor(){
        Object.defineProperty(this, _switch, {
            value: __switch
        });
        Object.defineProperty(this, _bar, {
            value: bar
        });
    }
}
function __switch() {
    console.log("#switch called");
}
function bar() {
    console.log("#bar called");
}
export { TestCls };
let a = new TestCls;
a.foo();
