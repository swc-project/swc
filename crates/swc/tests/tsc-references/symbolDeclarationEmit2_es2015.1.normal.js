let _toPrimitive = Symbol.toPrimitive;
//@target: ES6
//@declaration: true
class C {
    constructor(){
        this[_toPrimitive] = "";
    }
}
