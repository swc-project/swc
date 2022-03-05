import * as swcHelpers from "@swc/helpers";
// @target: esnext, es2022, es2015, es5
class B {
}
B.a = 1;
B.b = 2;
class C extends B {
}
C.b = 3;
C.c = swcHelpers.get(swcHelpers.getPrototypeOf(C), "a", C);
var __ = {
    writable: true,
    value: (()=>{
        C.b;
        super.b;
        super.a;
    })()
};
