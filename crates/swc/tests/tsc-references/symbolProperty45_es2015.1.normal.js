let _hasInstance = Symbol.hasInstance, _toPrimitive = Symbol.toPrimitive;
//@target: ES6
class C {
    get [_hasInstance]() {
        return "";
    }
    get [_toPrimitive]() {
        return "";
    }
}
