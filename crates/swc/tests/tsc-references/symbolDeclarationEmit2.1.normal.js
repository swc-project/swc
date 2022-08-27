//// [symbolDeclarationEmit2.ts]
let _toPrimitive = Symbol.toPrimitive;
class C {
    constructor(){
        this[_toPrimitive] = "";
    }
}
