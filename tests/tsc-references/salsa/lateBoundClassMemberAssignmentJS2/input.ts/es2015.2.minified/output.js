export class MyClass {
    method() {
        this["my-fake-sym"] = "yep", this["my-fake-sym"];
    }
    constructor(){
        this["my-fake-sym"] = "ok";
    }
}
