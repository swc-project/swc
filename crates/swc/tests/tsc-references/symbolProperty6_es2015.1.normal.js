var _key;
let tmp = (_key = Symbol.iterator, Symbol.toPrimitive), _toStringTag = Symbol.toStringTag;
//@target: ES6
class C {
    [tmp]() {}
    get [_toStringTag]() {
        return 0;
    }
    constructor(){
        this[_key] = 0;
    }
}
