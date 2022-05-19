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
var c = new C();
c.x, c.a, c.b, c.c(), c.d(), C.e, C.f(), C.g();
