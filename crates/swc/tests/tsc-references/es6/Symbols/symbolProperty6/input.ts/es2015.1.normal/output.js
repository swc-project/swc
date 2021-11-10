var _key;
var tmp = (_key = Symbol.iterator, Symbol.toPrimitive), tmp1 = Symbol.toStringTag;
//@target: ES6
class C {
    [tmp]() {
    }
    get [tmp1]() {
        return 0;
    }
    constructor(){
        this[_key] = 0;
    }
}
