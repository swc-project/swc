// @target: esnext, es2022
const a = 1;
class C {
}
var __ = {
    writable: true,
    value: (()=>{
        console.log(C.f1, C.f2, C.f3);
    })()
};
var __1 = {
    writable: true,
    value: (()=>{
        console.log(C.f1, C.f2, C.f3);
    })()
};
C.f1 = 1;
C.f2 = 2;
C.f3 = 3;
