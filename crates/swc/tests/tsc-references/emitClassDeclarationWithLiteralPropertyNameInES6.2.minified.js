//// [emitClassDeclarationWithLiteralPropertyNameInES6.ts]
class B {
    foo() {}
    0b1110() {}
    11() {}
    interface() {}
    constructor(){
        this.hello = 10, this[0b110] = "world", this[0o23534] = "WORLD", this[20] = "twenty";
    }
}
B.hi = 10000, B[22] = "twenty-two", B[0b101] = "binary", B[0o3235] = "octal";
