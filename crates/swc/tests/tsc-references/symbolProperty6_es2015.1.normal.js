let _toPrimitive = Symbol.toPrimitive, _toStringTag = Symbol.toStringTag;
//@target: ES6
class C {
    [_toPrimitive]() {}
    get [_toStringTag]() {
        return 0;
    }
    constructor(){
        this[Symbol.iterator] = 0;
    }
}
