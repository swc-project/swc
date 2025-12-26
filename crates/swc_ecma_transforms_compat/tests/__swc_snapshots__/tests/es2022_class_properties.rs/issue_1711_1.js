var _value = new WeakSet();
class Foo {
    // #value = 1;
    get(target) {
        return value;
    }
    constructor(){
        _value.add(this);
    }
}
function value() {
    return 1;
}
