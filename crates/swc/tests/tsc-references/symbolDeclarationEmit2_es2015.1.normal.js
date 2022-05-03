//@target: ES6
//@declaration: true
class C {
    constructor(){
        this[Symbol.toPrimitive] = "";
    }
}
