class Base {
    constructor(p){
        this.p = p;
    }
}
class Derived extends Base {
    constructor(p){
        super(p);
        this.p = p;
        this.p; // OK
    }
}
var d;
d.p; // public, OK
