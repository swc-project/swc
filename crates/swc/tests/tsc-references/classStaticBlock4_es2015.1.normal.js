// @target: esnext, es2022
class C {
}
C.s1 = 1;
var __ = {
    writable: true,
    value: (()=>{
        C.s1;
        C.s1;
        C.s2;
        C.s2;
    })()
};
C.s2 = 2;
C.ss2 = C.s1;
