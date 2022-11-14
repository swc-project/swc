//// [parserSymbolProperty6.ts]
let _Symbol_toStringTag = Symbol.toStringTag;
class C {
    constructor(){
        this[_Symbol_toStringTag] = "";
    }
}
