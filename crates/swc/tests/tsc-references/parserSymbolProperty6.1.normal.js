//// [parserSymbolProperty6.ts]
let prop;
class C {
    constructor(){
        this[prop] = "";
    }
}
prop = Symbol.toStringTag;
