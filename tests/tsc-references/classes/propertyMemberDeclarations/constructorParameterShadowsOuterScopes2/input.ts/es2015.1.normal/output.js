// @target: esnext
// @useDefineForClassFields: true
// With useDefineForClassFields: true and ESNext target, initializer
// expressions for property declarations are evaluated in the scope of
// the class body and are permitted to reference parameters or local
// variables of the constructor. This is different from classic
// Typescript behaviour, with useDefineForClassFields: false. There,
// initialisers of property declarations are evaluated in the scope of
// the constructor body.
// Note that when class fields are accepted in the ECMAScript
// standard, the target will become that year's ES20xx
var x = 1;
class C {
    constructor(x1){
        this.b // ok
         = x1;
    }
}
var y = 1;
class D {
    constructor(x2){
        this.b // ok
         = y;
        var y = "";
    }
}
class E {
    constructor(z){
        this.b // not ok
         = z;
    }
}
