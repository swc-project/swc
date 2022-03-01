let _toPrimitive = Symbol.toPrimitive;
//@target: ES6
//@declaration: true
class C {
    [_toPrimitive](x) {}
}
