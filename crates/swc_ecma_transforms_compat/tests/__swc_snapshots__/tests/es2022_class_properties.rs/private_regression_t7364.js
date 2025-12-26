var _myAsyncMethod = new WeakMap(), _myAsyncMethod1 = new WeakMap(), _myAsyncMethod2 = new WeakMap();
class MyClass {
    constructor(){
        _class_private_field_init(this, _myAsyncMethod, {
            writable: true,
            value: ()=>_async_to_generator(function*() {
                    console.log(this);
                }).call(this)
        });
    }
}
(class MyClass2 {
    constructor(){
        _class_private_field_init(this, _myAsyncMethod1, {
            writable: true,
            value: ()=>_async_to_generator(function*() {
                    console.log(this);
                }).call(this)
        });
    }
});
export default class MyClass3 {
    constructor(){
        _class_private_field_init(this, _myAsyncMethod2, {
            writable: true,
            value: ()=>_async_to_generator(function*() {
                    console.log(this);
                }).call(this)
        });
    }
}
