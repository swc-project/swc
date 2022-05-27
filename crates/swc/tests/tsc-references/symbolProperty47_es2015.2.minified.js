class C {
    get [Symbol.hasInstance]() {
        return "";
    }
    set [Symbol.hasInstance](x) {}
}
(new C)[Symbol.hasInstance] = 0, (new C)[Symbol.hasInstance] = "";
