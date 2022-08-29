//// [privateNameBadSuperUseDefineForClassFields.ts]
class B {
}
class A extends B {
    #x;
    constructor(){
        this;
        super();
    }
}
