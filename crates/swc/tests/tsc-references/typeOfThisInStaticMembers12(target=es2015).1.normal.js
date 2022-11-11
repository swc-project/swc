//// [typeOfThisInStaticMembers12.ts]
let _this_c, _this_c1;
var _Inner;
class C {
}
C.c = "foo";
C.bar = (_this_c = C.c, _this_c1 = C.c, _Inner = class Inner {
    constructor(){
        this[_this_c1] = 123;
    }
}, _Inner[_this_c] = 123, _Inner);
