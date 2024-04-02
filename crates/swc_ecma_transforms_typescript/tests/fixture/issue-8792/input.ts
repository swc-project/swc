class MyClass {
    ["constructor"]!: typeof MyClass;
    other!: number;

    static myStatic() {
        console.log("myStatic")
    }

    myMethod() {
        this.constructor.myStatic();
    }
}