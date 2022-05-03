var _key;
//@target: ES5
class C {
    constructor(){
        this[_key] = "";
    }
}
_key = Symbol.toStringTag;
