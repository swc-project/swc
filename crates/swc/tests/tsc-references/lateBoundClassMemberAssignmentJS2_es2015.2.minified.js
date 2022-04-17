let _sym = "my-fake-sym";
export class MyClass {
    method() {
        this[_sym] = "yep", this[_sym];
    }
    constructor(){
        this[_sym] = "ok";
    }
}
