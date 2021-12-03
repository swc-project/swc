class C1 {
    constructor(x){
        this.x = x;
    }
}
var c1;
c1.x // OK
;
class C2 {
    constructor(p){
        this.p = p;
    }
}
var c2;
c2.p // private, error
;
class C3 {
    constructor(p){
        this.p = p;
    }
}
var c3;
c3.p // protected, error
;
class Derived extends C3 {
    constructor(p){
        super(p);
        this.p; // OK
    }
}
