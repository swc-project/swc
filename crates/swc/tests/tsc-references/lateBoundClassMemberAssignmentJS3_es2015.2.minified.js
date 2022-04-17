let _sym = Symbol("_sym");
export class MyClass {
    method() {
        var self = this;
        self[_sym] = "yep", self[_sym];
    }
    constructor(){
        var self = this;
        self[_sym] = "ok";
    }
}
