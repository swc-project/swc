//// [computedPropertyNames25_ES6.ts]
class Base {
    bar() {
        return 0;
    }
}
class C extends Base {
    foo() {
        return super.bar(), 0;
    }
}
