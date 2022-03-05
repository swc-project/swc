// Initializer expressions for instance member variables are evaluated in the scope of the class constructor body but are not permitted to reference parameters or local variables of the constructor. 
class C {
    constructor(x){
        this.a = z // error
        ;
        this.c = this.z // error
        ;
        z = 1;
    }
}
class D {
    constructor(x){
        this.a = z // error
        ;
        this.c = this.z // error
        ;
        z = 1;
    }
}
