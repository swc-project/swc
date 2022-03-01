let _hasInstance = Symbol.hasInstance, _hasInstance1 = Symbol.hasInstance;
class C {
    get [_hasInstance]() {
        return "";
    }
    set [_hasInstance1](x) {}
}
(new C)[Symbol.hasInstance] = 0, (new C)[Symbol.hasInstance] = "";
