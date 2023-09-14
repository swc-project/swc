//// [symbolDeclarationEmit2.ts]
let prop;
class C {
    constructor(){
        this[prop] = "";
    }
}
prop = Symbol.toPrimitive;
