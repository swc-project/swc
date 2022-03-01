let _toPrimitive = Symbol.toPrimitive, _toStringTag = Symbol.toStringTag;
//@target: ES6
//@declaration: true
class C {
    get [_toPrimitive]() {
        return "";
    }
    set [_toStringTag](x) {}
}
