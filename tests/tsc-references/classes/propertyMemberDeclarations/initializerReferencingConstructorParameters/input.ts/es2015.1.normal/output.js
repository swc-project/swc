// Initializer expressions for instance member variables are evaluated in the scope of the class constructor body but are not permitted to reference parameters or local variables of the constructor. 
class C {
    constructor(x){
        this.a // error
         = x;
    }
}
class D {
    constructor(x){
        this.x = x;
        this.a // error
         = x;
    }
}
class E {
    constructor(x){
        this.x = x;
        this.a // ok
         = this.x;
    }
}
class F {
    constructor(x){
        this.x = x;
        this.a // ok
         = this.x;
        this.b // error
         = x;
    }
}
