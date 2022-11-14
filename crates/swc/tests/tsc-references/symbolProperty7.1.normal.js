//// [symbolProperty7.ts]
let _Symbol = Symbol(), _Symbol1 = Symbol(), _Symbol2 = Symbol();
class C {
    [_Symbol1]() {}
    get [_Symbol2]() {
        return 0;
    }
    constructor(){
        this[_Symbol] = 0;
    }
}
