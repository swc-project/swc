//// [emitClassDeclarationWithExtensionAndTypeArgumentInES6.ts]
class B {
    constructor(a){}
}
class C extends B {
}
class D extends B {
    constructor(b){
        super(b);
    }
}
