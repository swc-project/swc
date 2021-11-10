// Initializer expressions for instance member variables are evaluated in the scope of the class constructor 
// body but are not permitted to reference parameters or local variables of the constructor.
// This effectively means that entities from outer scopes by the same name as a constructor parameter or 
// local variable are inaccessible in initializer expressions for instance member variables
var x = 1;
class C {
    constructor(x1){
        this.b // error, evaluated in scope of constructor, cannot reference x
         = x1;
        x1 = 2; // error, x is string
    }
}
var y = 1;
class D {
    constructor(x2){
        this.b // error, evaluated in scope of constructor, cannot reference y
         = y;
        var y = "";
    }
}
