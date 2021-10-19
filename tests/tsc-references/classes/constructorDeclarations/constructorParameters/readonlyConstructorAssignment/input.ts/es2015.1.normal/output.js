// Tests that readonly parameter properties behave like regular readonly properties
class A {
    constructor(x){
        this.x = x;
        this.x = 0;
    }
}
class B extends A {
    constructor(x){
        super(x);
        // Fails, x is readonly
        this.x = 1;
    }
}
class C extends A {
    // This is the usual behavior of readonly properties:
    // if one is redeclared in a base class, then it can be assigned to.
    constructor(x){
        super(x);
        this.x = x;
        this.x = 1;
    }
}
class D {
    constructor(x){
        this.x = x;
        this.x = 0;
    }
}
// Fails, can't redeclare readonly property
class E extends D {
    constructor(x){
        super(x);
        this.x = x;
        this.x = 1;
    }
}
