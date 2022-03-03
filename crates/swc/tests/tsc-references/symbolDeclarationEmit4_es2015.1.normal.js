let _toPrimitive = Symbol.toPrimitive, _toPrimitive1 = Symbol.toPrimitive;
//@target: ES6
//@declaration: true
class C {
    get [_toPrimitive]() {
        return "";
    }
    set [_toPrimitive1](x) {}
}
