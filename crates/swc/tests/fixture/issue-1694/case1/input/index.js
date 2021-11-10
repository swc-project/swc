class MyClass {
    #get() {
        console.log("Hi from a method with a private identifier called #get");
    }
    constructor() {
        this.#get();
    }
}

const instance = new MyClass();