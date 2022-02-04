class C {
    constructor(){
        this.readonlyCall = Symbol(), this.readwriteCall = Symbol();
    }
}
C.readonlyStaticCall = Symbol(), C.readonlyStaticTypeAndCall = Symbol(), C.readwriteStaticCall = Symbol();
