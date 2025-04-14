class MyClass {
    constructor(){
        _define_property(this, "myAsyncMethod", ()=>/*#__PURE__*/ _async_to_generator(function*() {
                console.log(this);
            }).call(this));
    }
}
(class MyClass2 {
    constructor(){
        _define_property(this, "myAsyncMethod", ()=>/*#__PURE__*/ _async_to_generator(function*() {
                console.log(this);
            }).call(this));
    }
});
class MyClass3 {
    constructor(){
        _define_property(this, "myAsyncMethod", ()=>/*#__PURE__*/ _async_to_generator(function*() {
                console.log(this);
            }).call(this));
    }
}
export { MyClass3 as default };
