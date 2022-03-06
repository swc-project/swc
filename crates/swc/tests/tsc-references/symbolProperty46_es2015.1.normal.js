let _hasInstance = Symbol.hasInstance, _hasInstance1 = Symbol.hasInstance;
//@target: ES6
class C {
    get [_hasInstance]() {
        return "";
    }
    // Should take a string
    set [_hasInstance1](x) {}
}
(new C)[Symbol.hasInstance] = 0;
(new C)[Symbol.hasInstance] = "";
