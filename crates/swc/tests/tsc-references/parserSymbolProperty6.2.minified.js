//// [parserSymbolProperty6.ts]
let _toStringTag = Symbol.toStringTag;
class C {
    constructor(){
        this[_toStringTag] = "";
    }
}
