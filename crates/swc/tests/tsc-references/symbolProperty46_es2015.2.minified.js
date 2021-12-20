var tmp = Symbol.hasInstance, tmp1 = Symbol.hasInstance;
class C {
    get [tmp]() {
        return "";
    }
    set [tmp1](x) {
    }
}
(new C)[Symbol.hasInstance] = 0, (new C)[Symbol.hasInstance] = "";
