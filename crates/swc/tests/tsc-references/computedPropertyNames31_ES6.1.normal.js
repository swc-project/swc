//// [computedPropertyNames31_ES6.ts]
class Base {
    bar() {
        return 0;
    }
}
class C extends Base {
    foo() {
        ()=>{
            var obj = {
                [super.bar()] () {}
            };
        };
        return 0;
    }
}
