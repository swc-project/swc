class MyClass {
    static myStatic() {
        console.log("myStatic");
    }
    myMethod() {
        this.constructor.myStatic();
    }
}
