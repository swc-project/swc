//// [computedPropertyNames28_ES6.ts]
class Base {
}
class C extends Base {
    constructor(){
        super();
        var obj = {
            [(super(), "prop")] () {}
        };
    }
}
