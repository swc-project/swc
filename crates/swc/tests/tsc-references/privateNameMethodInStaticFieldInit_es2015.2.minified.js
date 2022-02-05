var _method = new WeakSet();
class C {
    constructor(){
        _method.add(this);
    }
}
C.s = new C().#method(), console.log(C.s);
