// accessing any protected outside the class is an error
class C {
    c() {
        return '';
    }
    static f() {
        return '';
    }
    constructor(){
        this.a = '';
        this.b = '';
        this.d = ()=>'';
    }
}
C.g = ()=>'';
class D extends C {
    method() {
        // No errors
        var d = new D();
        var r1 = d.x;
        var r2 = d.a;
        var r3 = d.b;
        var r4 = d.c();
        var r5 = d.d();
        var r6 = C.e;
        var r7 = C.f();
        var r8 = C.g();
    }
}
