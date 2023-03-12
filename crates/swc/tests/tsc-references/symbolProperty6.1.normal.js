//// [symbolProperty6.ts]
let prop, prop1;
let _Symbol_toPrimitive = Symbol.toPrimitive, _Symbol_toStringTag = Symbol.toStringTag;
class C {
    [_Symbol_toPrimitive]() {}
    get [_Symbol_toStringTag]() {
        return 0;
    }
    constructor(){
        this[prop] = 0;
    }
}
(()=>{
    prop = Symbol.iterator;
    prop1 = Symbol.unscopables;
})();
