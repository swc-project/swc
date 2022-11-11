//// [typeOfThisInStaticMembers12.ts]
var _Inner;
let _this_c, _this_c1;
class C {
}
C.c = "foo", C.bar = (_this_c = C.c, _this_c1 = C.c, (_Inner = class {
    constructor(){
        this[_this_c1] = 123;
    }
})[_this_c] = 123, _Inner);
