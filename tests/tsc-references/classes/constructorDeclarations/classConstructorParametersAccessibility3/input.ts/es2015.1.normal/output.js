class Base {
    constructor(p){
        this.p = p;
    }
}
class Derived extends Base {
    constructor(p1){
        super(p1);
        this.p = p1;
        this.p; // OK
    }
}
var d;
d.p; // public, OK
