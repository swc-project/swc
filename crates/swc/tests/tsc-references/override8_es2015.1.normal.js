// @declaration: true
// @noImplicitOverride: true
class B {
}
class D extends B {
    constructor(a, b){
        super();
        this.a = a;
        this.b = b;
    }
}
class BB {
    constructor(a){
        this.a = a;
    }
}
class DD extends BB {
    constructor(a){
        super(a);
        this.a = a;
    }
}
class DDD extends BB {
    constructor(a){
        super(a);
        this.a = a;
    }
}
