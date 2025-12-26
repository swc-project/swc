var _get = new WeakSet();
class MyClass {
    constructor(){
        _get.add(this);
        get.call(this, foo);
    }
}
function get() {
    return 1;
}
