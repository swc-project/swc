//// [typeOfThisInStaticMembers12.ts]
var _Inner;
let _c;
class C {
}
C.c = "foo", C.bar = (_c = C.c, (_Inner = class {
    constructor(){
        this[C.c] = 123;
    }
})[_c] = 123, _Inner);
