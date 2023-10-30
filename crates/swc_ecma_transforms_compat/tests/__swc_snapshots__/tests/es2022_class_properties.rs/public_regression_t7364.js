class MyClass {
    constructor(){
        var _this = this;
        _define_property(this, "myAsyncMethod", /*#__PURE__*/ _async_to_generator(function*() {
            console.log(_this);
        }));
    }
}
(class MyClass2 {
    constructor(){
        var _this = this;
        _define_property(this, "myAsyncMethod", /*#__PURE__*/ _async_to_generator(function*() {
            console.log(_this);
        }));
    }
});
class MyClass3 {
    constructor(){
        var _this = this;
        _define_property(this, "myAsyncMethod", /*#__PURE__*/ _async_to_generator(function*() {
            console.log(_this);
        }));
    }
}
export { MyClass3 as default };
