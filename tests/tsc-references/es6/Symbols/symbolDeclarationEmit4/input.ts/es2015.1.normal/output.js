var tmp = Symbol.toPrimitive, tmp1 = Symbol.toPrimitive;
//@target: ES6
//@declaration: true
class C {
    get [tmp]() {
        return "";
    }
    set [tmp1](x) {
    }
}
