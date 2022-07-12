//@target: ES6
let _toStringTag = Symbol.toStringTag;
class C {
    constructor(){
        this[_toStringTag] = "";
    }
}
