//// [emitClassDeclarationWithPropertyAssignmentInES6.ts]
class C {
    constructor(){
        this.x = "Hello world";
    }
}
class D {
    constructor(){
        this.x = "Hello world";
        this.y = 10;
    }
}
class E extends D {
    constructor(...args){
        super(...args), this.z = true;
    }
}
class F extends D {
    constructor(){
        super(), this.z = true;
        this.j = "HI";
    }
}
