//// [emitClassDeclarationWithLiteralPropertyNameInES6.ts]
var __ = new WeakMap(), __2 = new WeakMap(), __3 = new WeakMap(), __4 = new WeakMap();
class B {
    foo() {}
    0b1110() {}
    11() {}
    interface() {}
    constructor(){
        this.hello = 10, this[0b110] = "world", this[0o23534] = "WORLD", this[20] = "twenty";
    }
}
__.set(B, {
    writable: !0,
    value: B.hi = 10000
}), __2.set(B, {
    writable: !0,
    value: B[22] = "twenty-two"
}), __3.set(B, {
    writable: !0,
    value: B[0b101] = "binary"
}), __4.set(B, {
    writable: !0,
    value: B[0o3235] = "octal"
});
