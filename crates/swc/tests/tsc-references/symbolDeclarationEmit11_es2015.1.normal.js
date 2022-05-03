var _key;
let _isConcatSpreadable = Symbol.isConcatSpreadable, _toPrimitive = Symbol.toPrimitive, _toPrimitive1 = Symbol.toPrimitive;
//@target: ES6
//@declaration: true
class C {
    static [_isConcatSpreadable]() {}
    static get [_toPrimitive]() {
        return "";
    }
    static set [_toPrimitive1](x) {}
}
C[_key] = 0;
_key = Symbol.iterator;
