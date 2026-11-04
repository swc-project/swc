class MyClass {
    constructor(){
        _class_static_private_method_get(MyClass, MyClass, get).call(MyClass, foo);
    }
}
function get() {
    return 1;
}
