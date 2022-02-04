// @target: esnext, es2022, es2015, es5
class B {
}
B.a = 1;
B.b = 2;
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        C.b;
        super.b;
        super.a;
    })()
};
C.b = 3;
C.c = super.a;
