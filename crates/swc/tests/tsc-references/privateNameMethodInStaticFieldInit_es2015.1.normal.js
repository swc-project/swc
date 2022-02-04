var _method = new WeakSet();
// @target: es2015
class C {
    constructor(){
        _method.add(this);
    }
}
function method() {
    return 42;
}
C.s = new C().#method();
console.log(C.s);
