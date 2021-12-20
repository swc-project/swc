var _key;
//@target: ES6
class C {
    constructor(){
        this[_key] = "";
    }
}
_key = Symbol.toStringTag;
