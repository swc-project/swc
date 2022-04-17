let _sym = Symbol("_sym");
export class MyClass {
    method() {
        this[_sym] = "yep", this[_sym];
    }
    constructor(){
        this[_sym] = "ok";
    }
}
