class C {
    c() {
        return '';
    }
    static f() {
        return '';
    }
    constructor(){
        this.a = '', this.b = '', this.d = ()=>'';
    }
}
C.g = ()=>'';
class D extends C {
    method() {
        var d = new D();
        d.x, d.a, d.b, d.c(), d.d(), C.e, C.f(), C.g();
    }
}
