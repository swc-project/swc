// Initializer expressions for instance member variables are evaluated in the scope of the class constructor body but are not permitted to reference parameters or local variables of the constructor. 
class C {
    constructor(x1){
        this.a = x // error
        ;
    }
}
class D {
    constructor(x2){
        this.x = x2;
        this.a = x;
    }
}
class E {
    constructor(x){
        this.x = x;
        this.a = this.x;
    }
}
class F {
    constructor(x3){
        this.x = x3;
        this.a = this.x;
        this.b = x;
    }
}
