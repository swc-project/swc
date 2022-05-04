type Klass<T = any> = { new (...args: any[]): T };
function MyDecorator(klass: Klass): PropertyDecorator {
    return () => {
        // do something
        console.log(klass);
    };
}

class MyClass {
    @MyDecorator(MyClass) prop: "";
}

console.log(new MyClass());
