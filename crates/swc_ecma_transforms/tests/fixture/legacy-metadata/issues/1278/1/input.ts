function MyDecorator(klass) {
    return () => {
        // do something
        console.log(klass);
    };
}

class MyClass {
    @MyDecorator(MyClass) prop: "";
}

console.log(new MyClass());
