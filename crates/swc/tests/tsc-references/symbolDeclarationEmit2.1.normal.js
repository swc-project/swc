//// [symbolDeclarationEmit2.ts]
class C {
    constructor(){
        this[Symbol.toPrimitive] = "";
    }
}
