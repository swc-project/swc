var _key;
//@target: ES6
//@declaration: true
class C {
    constructor(){
        this[_key] = "";
    }
}
_key = Symbol.toPrimitive;
