//// [typeOfThisInStaticMembers12.ts]
var _Inner;
let _c, _c1;
class C {
}
C.c = "foo", C.bar = (_c = C.c, (_Inner = class {
    constructor(){
        this[_c1 = C.c] = 123;
    }
})[_c] = 123, _Inner);
