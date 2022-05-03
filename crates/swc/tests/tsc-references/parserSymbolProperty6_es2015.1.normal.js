let _toStringTag = Symbol.toStringTag;
//@target: ES6
class C {
    constructor(){
        this[_toStringTag] = "";
    }
}
