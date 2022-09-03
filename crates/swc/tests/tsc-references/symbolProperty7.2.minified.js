//// [symbolProperty7.ts]
let _ref = Symbol(), tmp = Symbol(), tmp1 = Symbol();
class C {
    [tmp]() {}
    get [tmp1]() {
        return 0;
    }
    constructor(){
        this[_ref] = 0;
    }
}
