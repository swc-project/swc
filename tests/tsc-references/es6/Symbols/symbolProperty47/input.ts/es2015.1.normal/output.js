var tmp = Symbol.hasInstance, tmp1 = Symbol.hasInstance;
//@target: ES6
class C {
    get [tmp]() {
        return "";
    }
    // Should take a string
    set [tmp1](x) {
    }
}
(new C)[Symbol.hasInstance] = 0;
(new C)[Symbol.hasInstance] = "";
