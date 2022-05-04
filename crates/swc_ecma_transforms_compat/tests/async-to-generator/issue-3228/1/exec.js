class StaticTestClass {
    static testProp = "Hello world!";

    static testMethod = () => {
        console.log(this.testProp);
    };
}

StaticTestClass.testMethod();
