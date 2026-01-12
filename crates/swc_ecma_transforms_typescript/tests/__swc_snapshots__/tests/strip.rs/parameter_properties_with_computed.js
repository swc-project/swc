var _class;
let prop;
class A {
    constructor(a = 1){
        this.a = a;
        this[prop] = 456;
    }
}
prop = console.log(123);
let prop1;
let b = (_class = class {
    constructor(a = 1){
        this.a = a;
        this[prop1] = 123;
    }
}, prop1 = console.log(456), _class);
