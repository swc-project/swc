// Tests that readonly parameter properties behave like regular readonly properties
class A {
    constructor(x){
        this.x = x;
        this.x = 0;
    }
}
class B extends A {
    constructor(x1){
        super(x1);
        // Fails, x is readonly
        this.x = 1;
    }
}
class C extends A {
    // This is the usual behavior of readonly properties:
    // if one is redeclared in a base class, then it can be assigned to.
    constructor(x2){
        super(x2);
        this.x = x2;
        this.x = 1;
    }
}
class D {
    constructor(x3){
        this.x = x3;
        this.x = 0;
    }
}
// Fails, can't redeclare readonly property
class E extends D {
    constructor(x4){
        super(x4);
        this.x = x4;
        this.x = 1;
    }
}
