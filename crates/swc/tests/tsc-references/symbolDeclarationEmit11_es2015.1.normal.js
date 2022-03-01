var _key;
let tmp = (_key = Symbol.iterator, Symbol.isConcatSpreadable), _toPrimitive = Symbol.toPrimitive, _toPrimitive1 = Symbol.toPrimitive;
//@target: ES6
//@declaration: true
class C {
    static [tmp]() {}
    static get [_toPrimitive]() {
        return "";
    }
    static set [_toPrimitive1](x) {}
}
C[_key] = 0;
