let _toStringTag = Symbol.toStringTag;
//@target: ES5
class C {
    constructor(){
        this[_toStringTag] = "";
    }
}
