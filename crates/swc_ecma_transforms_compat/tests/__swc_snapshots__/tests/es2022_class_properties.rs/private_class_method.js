var _foo = new WeakSet();
class Foo {
    constructor(){
        _foo.add(this);
    }
}
function foo() {}
