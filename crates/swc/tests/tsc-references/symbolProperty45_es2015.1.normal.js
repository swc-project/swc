var tmp = Symbol.hasInstance, tmp1 = Symbol.toPrimitive;
//@target: ES6
class C {
    get [tmp]() {
        return "";
    }
    get [tmp1]() {
        return "";
    }
}
