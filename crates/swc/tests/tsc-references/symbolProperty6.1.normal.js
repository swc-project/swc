//// [symbolProperty6.ts]
let _Symbol_iterator = Symbol.iterator, _Symbol_toPrimitive = Symbol.toPrimitive, _Symbol_toStringTag = Symbol.toStringTag;
class C {
    [_Symbol_toPrimitive]() {}
    get [_Symbol_toStringTag]() {
        return 0;
    }
    constructor(){
        this[_Symbol_iterator] = 0;
    }
}
