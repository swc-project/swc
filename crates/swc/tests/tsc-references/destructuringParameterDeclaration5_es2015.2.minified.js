class Class {
    constructor(){}
}
class SubClass extends Class {
    constructor(){
        super();
    }
}
class D {
    constructor(){}
}
new Class(), new Class(), new SubClass(), new class extends D {
    constructor(){
        super();
    }
}(), new SubClass(), new Class();
