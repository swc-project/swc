let prop, prop1;
class Foo {
    static{
        prop = (console.log(1), 1);
        prop1 = (console.log(2), 2);
    }
    static{
        console.log("Foo");
    }
    constructor(){
        this[prop] = 1;
        this[Symbol.iterator] = 2;
        this[prop1] = 1;
    }
}
