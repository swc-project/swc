// Initializer expressions for instance member variables are evaluated in the scope of the class constructor body but are not permitted to reference parameters or local variables of the constructor. 
class C {
    constructor(x){
        this.a // error
         = z;
        this.c // error
         = this.z;
        z = 1;
    }
}
class D {
    constructor(x1){
        this.a // error
         = z;
        this.c // error
         = this.z;
        z = 1;
    }
}
