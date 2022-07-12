//@target: ES6
//@declaration: true
let _toPrimitive = Symbol.toPrimitive;
class C {
    constructor(){
        this[_toPrimitive] = "";
    }
}
