//// [symbolDeclarationEmit2.ts]
let _Symbol_toPrimitive = Symbol.toPrimitive;
class C {
    constructor(){
        this[_Symbol_toPrimitive] = "";
    }
}
