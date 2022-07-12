//@target: ES6
let _iterator = Symbol.iterator, _toPrimitive = Symbol.toPrimitive, _toStringTag = Symbol.toStringTag;
class C {
    [_toPrimitive]() {}
    get [_toStringTag]() {
        return 0;
    }
    constructor(){
        this[_iterator] = 0;
    }
}
