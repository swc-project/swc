//// [typeOfThisInStaticMembers12.ts]
let _c, _c1;
var _Inner;
class C {
}
C.c = "foo";
C.bar = (_c = C.c, _c1 = C.c, _Inner = class Inner {
    constructor(){
        this[_c1] = 123;
    }
}, _Inner[_c] = 123, _Inner);
